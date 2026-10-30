<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReconcileErpSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'erp:reconcile-subscriptions {--force : Force sync even if already marked as synced}';

    /**
     * The console command description.
     */
    protected $description = 'Audit and reconcile all pending, failed, or unsynced customer subscriptions with the ERP backend.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting ERP Subscription Reconciliation...');

        $apiUrl = config('services.erp.api_url');
        $provisioningKey = config('services.erp.provisioning_key');

        if (empty($apiUrl) || empty($provisioningKey)) {
            $this->error('ERP API URL or provisioning key is not configured in services.php / .env.');
            return Command::FAILURE;
        }

        $force = (bool) $this->option('force');
        $users = User::where('role', 'user')->get();

        $syncedCount = 0;
        $failedCount = 0;
        $skippedCount = 0;

        foreach ($users as $user) {
            $payment = Payment::latestCompletedOrActivePlanForUser($user->id)
                ?: Payment::where('user_id', $user->id)->planSubscriptions()->latest()->first();

            if (! $payment) {
                $skippedCount++;
                continue;
            }

            $manifest = is_array($payment->addons_manifest) ? $payment->addons_manifest : [];
            $erpSync = is_array($manifest['erp_sync'] ?? null) ? $manifest['erp_sync'] : [];
            $currentStatus = $erpSync['status'] ?? 'unknown';

            if ($currentStatus === 'synced' && ! $force) {
                $skippedCount++;
                continue;
            }

            $cycle = $manifest['billing_cycle'] ?? 'monthly';
            $isActive = in_array(strtolower((string) $payment->status), ['completed', 'active'])
                && $payment->expires_at
                && $payment->expires_at->isFuture();

            $status = $isActive ? 'active' : 'suspended';
            $action = $isActive ? 'update' : 'terminate';

            $this->line("Reconciling {$user->email} ({$payment->package_name}, {$status})...");

            try {
                $response = Http::withHeaders([
                    'X-ERP-Provisioning-Key' => $provisioningKey,
                    'Accept'                 => 'application/json',
                    'Content-Type'           => 'application/json',
                ])->timeout(15)->post("{$apiUrl}/api/internal/subscriptions/sync", [
                    'email'         => $user->email,
                    'name'          => $user->name,
                    'business_name' => $user->business_name,
                    'password_hash' => $user->password,
                    'plan'          => $payment->package_name,
                    'status'        => $status,
                    'billing_cycle' => $cycle,
                    'expires_at'    => $payment->expires_at?->toIso8601String(),
                    'action'        => $action,
                ]);

                $isSuccess = $response->successful();

                $manifest['erp_sync'] = [
                    'status'       => $isSuccess ? 'synced' : 'failed',
                    'synced_at'    => now()->toIso8601String(),
                    'attempted_at' => now()->toIso8601String(),
                    'last_error'   => $isSuccess ? null : "HTTP {$response->status()}: " . substr($response->body(), 0, 100),
                ];
                $payment->update(['addons_manifest' => $manifest]);

                if ($isSuccess) {
                    $syncedCount++;
                    $this->info("  -> SUCCESS: Synced {$user->email}");
                } else {
                    $failedCount++;
                    $this->warn("  -> FAILED: HTTP {$response->status()} for {$user->email}");
                }
            } catch (\Throwable $e) {
                $failedCount++;
                $manifest['erp_sync'] = [
                    'status'       => 'failed',
                    'attempted_at' => now()->toIso8601String(),
                    'last_error'   => $e->getMessage(),
                ];
                $payment->update(['addons_manifest' => $manifest]);
                $this->error("  -> EXCEPTION: {$e->getMessage()} for {$user->email}");
            }
        }

        $this->newLine();
        $this->table(
            ['Total Processed', 'Synced', 'Failed', 'Skipped (Already Synced)'],
            [[$users->count(), $syncedCount, $failedCount, $skippedCount]]
        );

        return $failedCount === 0 ? Command::SUCCESS : Command::FAILURE;
    }
}

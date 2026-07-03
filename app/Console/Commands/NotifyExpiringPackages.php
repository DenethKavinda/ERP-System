<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Payment;
use App\Notifications\PackageExpiringSoon;
use Carbon\Carbon;

class NotifyExpiringPackages extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'packages:notify-expiring';

    /**
     * The console command description.
     */
    protected $description = 'Find packages expiring in exactly 5 days and send renewal alert notifications to users.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Calculate the beginning and end timestamps exactly 5 days from now
        $targetDateStart = Carbon::now()->addDays(5)->startOfDay();
        $targetDateEnd = Carbon::now()->addDays(5)->endOfDay();

        // Query active, completed payments tracking within that specific date boundary
        $expiringPayments = Payment::where('status', 'completed')
            ->whereBetween('expires_at', [$targetDateStart, $targetDateEnd])
            ->with('user') // Eager load user relationship mapping
            ->get();

        if ($expiringPayments->isEmpty()) {
            $this->info('No packages found expiring in 5 days.');
            return Command::SUCCESS;
        }

        $count = 0;
        foreach ($expiringPayments as $payment) {
            if ($payment->user) {
                // Send out the email alert hook
                $payment->user->notify(new PackageExpiringSoon($payment));
                $count++;
            }
        }

        $this->info("Successfully sent renewal notification alerts to {$count} customers.");
        return Command::SUCCESS;
    }
}

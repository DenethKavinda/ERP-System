<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Payment;
use App\Mail\ErpCredentialsMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'nic'           => 'required|string|unique:users,nic|max:20',
            'name'          => 'required|string|max:255',
            'business_name' => 'nullable|string|max:255',
            'address'       => 'required|string',
            'mobile_number' => 'required|string|max:20',
            'email'         => 'required|string|email|unique:users,email|max:255',
            'plan'          => 'nullable|string',
            'cycle'         => 'nullable|string',
            'addons'        => 'nullable|string',
        ]);

        // Generate a secure random password for both portal and ERP
        $plainPassword = $this->generateSecurePassword();
        $hashedPassword = Hash::make($plainPassword);

        // Create the portal user
        $user = new User();
        $user->nic           = $validated['nic'];
        $user->name          = $validated['name'];
        $user->business_name = $validated['business_name'] ?? null;
        $user->address       = $validated['address'];
        $user->mobile_number = $validated['mobile_number'];
        $user->email         = $validated['email'];
        $user->password      = $hashedPassword;
        $user->role          = 'user';
        $user->save();

        Auth::login($user);

        $requestedPlan = strtolower($request->input('plan', 'free'));
        $cycle = $request->input('cycle', 'monthly');

        // All public registrations begin as Free Starter 30-Day Evaluation Workspace.
        // Paid tiers are activated manually by the Admin after offline bank payment verification.
        $plan = 'free';
        $planName = 'ERP Free Starter';

        // Automatically activate 30-Day Free Starter Evaluation Plan in local payments ledger
        Payment::create([
            'order_id'        => 'FREE_' . strtoupper(uniqid()),
            'user_id'         => $user->id,
            'package_name'    => 'ERP Free Starter',
            'base_price'      => 0.00,
            'addons_total'    => 0.00,
            'amount'          => 0.00,
            'currency'        => 'LKR',
            'status'          => 'Completed',
            'expires_at'      => now()->addDays(30),
        ]);

        // Provision user in the ERP System via server-to-server API as Free Starter
        $erpProvisioned = $this->provisionErpAccount(
            $validated['name'],
            $validated['email'],
            $hashedPassword,
            $validated['business_name'] ?? null,
            'free'
        );

        // Send credentials email
        $erpAppUrl = env('ERP_APP_URL', 'https://erp-codexpressitsolutions.vercel.app/login');
        $portalUrl = config('app.url', 'https://portal.codexpressitsolutions.com');

        try {
            Mail::to($user->email)->send(new ErpCredentialsMail(
                $user->name,
                $user->email,
                $plainPassword,
                $erpAppUrl,
                $planName,
                $portalUrl
            ));
        } catch (\Throwable $e) {
            Log::error('Failed to send ERP credentials email: ' . $e->getMessage());
        }

        return redirect()->route('dashboard')->with([
            'new_account_activated' => true,
            'erp_login_email'       => $user->email,
            'erp_provisioned'       => $erpProvisioned,
            'plan_name'             => $planName,
            'requested_paid_plan'   => ($requestedPlan !== 'free') ? $requestedPlan : null,
        ]);
    }

    /**
     * Provision the user's admin account in the ERP system.
     * Calls the ErpUserProvisioningController endpoint.
     */
    private function provisionErpAccount(
        string $name,
        string $email,
        string $hashedPassword,
        ?string $companyName,
        string $plan = 'free'
    ): bool {
        $apiUrl = config('services.erp.api_url');
        $provisioningKey = config('services.erp.provisioning_key');

        if (empty($apiUrl) || empty($provisioningKey)) {
            Log::warning('ERP provisioning skipped: API URL or key not configured.');
            return false;
        }

        try {
            $response = Http::withHeaders([
                'X-ERP-Provisioning-Key' => $provisioningKey,
                'Accept'                 => 'application/json',
                'Content-Type'           => 'application/json',
            ])->timeout(15)->post("{$apiUrl}/api/internal/users", [
                'name'         => $name,
                'email'        => $email,
                'password'     => $hashedPassword,
                'company_name' => $companyName,
                'plan'         => $plan,
            ]);

            if ($response->successful()) {
                Log::info("ERP account provisioned for {$email}", $response->json());
                return true;
            }

            Log::error("ERP provisioning failed for {$email}", [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return false;
        } catch (\Throwable $e) {
            Log::error("ERP provisioning exception for {$email}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Generate a secure, user-friendly random password.
     * Format: 3 uppercase + 4 lowercase + 3 digits + 2 special = 12 chars, shuffled.
     */
    private function generateSecurePassword(): string
    {
        $upper   = substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ'), 0, 3);
        $lower   = substr(str_shuffle('abcdefghjkmnpqrstuvwxyz'), 0, 4);
        $digits  = substr(str_shuffle('23456789'), 0, 3);
        $special = substr(str_shuffle('!@#$&*'), 0, 2);

        return str_shuffle($upper . $lower . $digits . $special);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            if (Auth::user()->role === 'admin') {
                return redirect()->intended(route('admin.dashboard'));
            }

            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our system logs.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }
}

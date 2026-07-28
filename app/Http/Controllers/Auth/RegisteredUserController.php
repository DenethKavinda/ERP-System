<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nic' => 'required|string|max:20|unique:' . User::class . ',nic',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'mobile_number' => 'required|string|max:20',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class . ',email',
        ]);

        // The registration form deliberately does not ask the user to choose a
        // password. Generate it here and send it in the welcome email.
        $rawPassword = Str::password(16);

        $user = User::create([
            ...$validated,
            'password' => Hash::make($rawPassword),
            'role' => 'user',
        ]);

        try {
            $this->provisionErpUser($user);
        } catch (\Throwable $exception) {
            // Do not leave behind an account whose emailed credentials cannot
            // authenticate with the ERP application.
            $user->delete();

            Log::error('ERP user provisioning failed during registration.', [
                'email' => $user->email,
                'exception' => $exception,
            ]);

            throw ValidationException::withMessages([
                'email' => 'We could not create your ERP account. Please try again shortly.',
            ]);
        }

        // This is the route used by POST /register. Previously the mailable was
        // only sent by an unused AuthController, so registrations never mailed.
        Mail::to($user)->send(new WelcomeEmail($user, $rawPassword));

        event(new Registered($user));

        Auth::login($user);

        // 3. Dynamic destination handling routing users straight to your new ERP grid interface
        return redirect()->route('erp.index');
    }

    private function provisionErpUser(User $user): void
    {
        $url = config('services.erp.provisioning_url');
        $key = config('services.erp.provisioning_key');

        if (! is_string($url) || $url === '' || ! is_string($key) || $key === '') {
            throw new \RuntimeException('ERP provisioning is not configured.');
        }

        Http::acceptJson()
            ->timeout(10)
            ->withHeaders(['X-ERP-Provisioning-Key' => $key])
            ->post($url, [
                'name' => $user->name,
                'company_name' => "{$user->name}'s Company",
                'email' => $user->email,
                'password' => $user->password,
            ])
            ->throw();
    }
}

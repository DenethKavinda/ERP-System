<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\WelcomeEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
            'nic' => 'required|string|unique:users,nic|max:20',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'mobile_number' => 'required|string|max:20',
            'email' => 'required|string|email|unique:users,email|max:255',
        ]);

        // System-generated random password (e.g. 10 characters)
        $rawPassword = Str::random(10);

        $validated['password'] = Hash::make($rawPassword);
        $validated['role'] = 'user';

        $user = User::create($validated);

        // Immediately dispatch Welcome Email with system password & ERP login link
        try {
            Mail::to($user->email)->send(new WelcomeEmail($user, $rawPassword));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Registration welcome mail error: " . $e->getMessage());
        }

        Auth::login($user);

        return redirect()->route('erp.index');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Check the authenticated user's database role value strictly
            if (Auth::user()->role === 'admin') {
                // FIXED: Now accurately targeting the administrative dashboard named route
                return redirect()->intended(route('admin.dashboard.manager'));
            }

            // FIXED: Now accurately targeting the standard user dashboard named route
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

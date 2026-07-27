<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
            'password'      => 'required|string|min:8|confirmed',
        ]);

        // Instantiate directly to guarantee property setting
        $user = new User();
        $user->nic           = $validated['nic'];
        $user->name          = $validated['name'];
        $user->business_name = $request->input('business_name');
        $user->address       = $validated['address'];
        $user->mobile_number = $validated['mobile_number'];
        $user->email         = $validated['email'];
        $user->password      = Hash::make($validated['password']);
        $user->role          = 'user';
        $user->save(); // Persist explicitly

        Auth::login($user);

        return redirect()->route('erp.index');
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
                return redirect()->intended(route('admin.dashboard.manager'));
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

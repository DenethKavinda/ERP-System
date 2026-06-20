<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
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
        // 1. Validate all specific required fields matching your spec
        $request->validate([
            'nic' => 'required|string|max:20|unique:' . User::class . ',nic',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'mobile_number' => 'required|string|max:20',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class . ',email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 2. Persist the record into your modified users table mapping
        $user = User::create([
            'nic' => $request->nic,
            'name' => $request->name,
            'address' => $request->address,
            'mobile_number' => $request->mobile_number,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Secure database hashing
            'role' => 'user', // Default role assigned automatically
        ]);

        event(new Registered($user));

        Auth::login($user);

        // 3. Dynamic destination handling routing users straight to your new ERP grid interface
        return redirect()->route('erp.index');
    }
}

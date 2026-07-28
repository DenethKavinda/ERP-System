<?php

namespace Tests\Feature\Auth;

use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        Mail::fake();

        $response = $this->post('/register', [
            'nic' => '199512345678',
            'name' => 'Test User',
            'address' => '1 Test Street',
            'mobile_number' => '+94771234567',
            'email' => 'test@example.com',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('erp.index', absolute: false));

        $user = User::where('email', 'test@example.com')->firstOrFail();
        $this->assertSame('user', $user->role);
        $this->assertNotSame('', $user->password);

        Mail::assertSent(WelcomeEmail::class, function (WelcomeEmail $mail) use ($user) {
            return $mail->hasTo($user->email)
                && Hash::check($mail->rawPassword, $user->password);
        });
    }
}

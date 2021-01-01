<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $defaultHeaders = [
        "Origin" => "localhost",
    ];

    protected function getUserData($user)
    {
        return [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'is_admin' => $user->is_admin,
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        Notification::fake();
    }

    public function testSuccessfulLoginAttempt()
    {
        $plain_password = $this->faker()->password();
        $user = User::factory()->create([
            'password' => Hash::make($plain_password),
        ]);
        $request_data = [
            'email' => $user->email,
            'password' => $plain_password,
        ];
        $response = $this->postJson("/login", $request_data);
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals($this->getUserData($user), $data);
    }

    public function testFailedLoginAttempt()
    {
        $plain_password = $this->faker()->password();
        $user = User::factory()->create([
            'password' => Hash::make($plain_password),
        ]);
        $incorrect_password = $plain_password . "!";
        $request_data = [
            'email' => $user->email,
            'password' => $incorrect_password,
        ];
        $response = $this->postJson("/login", $request_data);
        $response->assertStatus(422);
    }

    public function testLogout()
    {
        $this->seed();
        $user = User::find(1);
        $response = $this->actingAs($user)->postJson("/logout");
        $response->assertStatus(204);
    }

    public function testFetchCurrentUser()
    {
        $this->seed();
        $user = User::find(1);
        $response = $this->actingAs($user)->getJson("/user");
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals($this->getUserData($user), $data);
    }

    public function testForgotPassword()
    {
        $this->seed();
        $user = User::find(1);
        $response = $this->postJson("/forgot-password", [
            'email' => $user->email,
        ]);
        $response->assertStatus(204);
        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function testForgotPasswordWithInvalidEmail()
    {
        $response = $this->postJson("/forgot-password", [
            'email' => $this->faker->email(),
        ]);
        $response->assertStatus(422);
        Notification::assertNothingSent();
    }

    public function testResetPassword()
    {
        $plain_password = $this->faker()->password();
        $this->seed();
        $user = User::find(1);
        $token = Password::createToken($user);
        $response = $this->postJson("/reset-password", [
            'token' => $token,
            'email' => $user->email,
            'password' => $plain_password,
        ]);
        $response->assertStatus(204);
    }

    public function testSetPassword()
    {
        $plain_password = $this->faker()->password();
        $password_hash = Hash::make($plain_password);
        $this->seed();
        $user = User::find(1);
        $old_user_password = $user->password;
        $token = Password::createToken($user);
        $response = $this->actingAs($user)->postJson("/set-password", [
            'password' => $plain_password,
        ]);
        $response->assertStatus(204);
        $user = User::find(1);
        $this->assertNotEquals($old_user_password, $user->password);
    }
}

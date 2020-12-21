<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
        $response = $this->postJson("/api/login", $request_data);
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
        $response = $this->postJson("/api/login", $request_data);
        $response->assertStatus(422);
    }

    public function testFetchCurrentUser()
    {
        $this->seed();
        $user = User::find(1);
        $response = $this->actingAs($user)->getJson("/api/user");
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals($this->getUserData($user), $data);
    }

    public function testForgotPassword()
    {
        $this->seed();
        $user = User::find(1);
        $response = $this->postJson("/api/forgot-password", [
            'email' => $user->email,
        ]);
        $response->assertStatus(204);
    }

    public function testResetPassword()
    {
        $plain_password = $this->faker()->password();
        $this->seed();
        $user = User::find(1);
        $token = Password::createToken($user);
        $response = $this->postJson("/api/reset-password", [
            'token' => $token,
            'email' => $user->email,
            'password' => $plain_password,
        ]);
        $response->assertStatus(204);
    }
}

<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\ExpectationFailedException;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Tests that the user model works.
     *
     * @return void
     */
    public function testDatabase()
    {
        $user = factory(User::class)->create();
        $this->assertDatabaseCount($user->getTable(), 1);
        $user->delete();
        $this->assertDeleted($user);
    }

    public function testCreateUser()
    {
        $this->seed();
        $user = factory(User::class)->make();

        $request_data = [
            "data" => [
                "type" => "users",
                "attributes" => [
                    "name" => $user->name,
                    "email" => $user->email,
                    "password" => $user->password,
                    "roles" => $user->roles,
                ],
            ],
        ];

        $response = $this->actingAs($user)
            ->postJson("/api/v1/timesheets", $request_data, [
                'Content-Type' => 'application/vnd.api+json',
                'Accept' => 'application/vnd.api+json'
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseCount('users', 3);
    }
}

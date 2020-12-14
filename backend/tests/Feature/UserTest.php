<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Tests that the user model works.
     *
     * @return void
     */
    public function testCreateUser()
    {
        $user = User::factory()->make();
        $user->save();
        $this->assertDatabaseCount($user->getTable(), 1);
    }

    /**
     * Tests that the user model works.
     *
     * @return void
     */
    public function testDeleteUser()
    {
        $user = User::factory()->create();
        $this->assertDatabaseCount($user->getTable(), 1);
        $user->delete();
        $this->assertDeleted($user);
    }
}

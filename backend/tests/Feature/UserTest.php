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
    public function testCreateUser()
    {
        $user = factory(User::class)->make();
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
        $user = factory(User::class)->create();
        $this->assertDatabaseCount($user->getTable(), 1);
        $user->delete();
        $this->assertDeleted($user);
    }
}

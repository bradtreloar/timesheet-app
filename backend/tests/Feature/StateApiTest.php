<?php

namespace Tests\Feature;

use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class StateApiTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $defaultHeaders = [
        "Origin" => "localhost",
    ];

    /**
     * {@inheritdoc}
     */
    public function setUp(): void
    {
        parent::setUp();
        Mail::fake();
    }

    public function testCompleteTimesheet()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $user = $timesheet->user;
        $response = $this->actingAs($user)
            ->postJson("/api/timesheets/{$timesheet->id}/complete");
        $response->assertStatus(204);
        $timesheet = Timesheet::first();
        $this->assertEquals(Timesheet::STATE_COMPLETED, $timesheet->state);
    }
}

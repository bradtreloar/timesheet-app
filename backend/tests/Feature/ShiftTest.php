<?php

namespace Tests\Feature;

use App\Models\Shift;
use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShiftTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Tests that the shift model works.
     *
     * @return void
     */
    public function testDatabase()
    {
        $user = User::factory()->create();
        $timesheet = Timesheet::factory()->create([
            'user_id' => $user->id
        ]);
        $shift = Shift::factory()->create([
            'timesheet_id' => $timesheet->id
        ]);
        $this->assertInstanceOf(
            Timesheet::class,
            $shift->timesheet()->getResults()
        );
        $this->assertDatabaseCount($shift->getTable(), 1);
        $shift->delete();
        $this->assertDeleted($shift);
    }

    /**
     * Tests that the calculated property `hours` is working.
     */
    public function testHours()
    {
        $user = User::factory()->create();
        $timesheet = Timesheet::factory()->create([
            'user_id' => $user->id
        ]);
        $shift = Shift::factory()->create([
            'timesheet_id' => $timesheet->id
        ]);
        $this->assertNotNull($shift->hours);
        $this->assertGreaterThan(0, (float) $shift->hours);
    }
}

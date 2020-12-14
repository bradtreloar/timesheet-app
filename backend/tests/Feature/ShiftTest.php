<?php

namespace Tests\Feature;

use App\Shift;
use App\Timesheet;
use App\User;
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
        $user = factory(User::class)->create();
        $timesheet = factory(Timesheet::class)->create([
            'user_id' => $user->id
        ]);
        $shift = factory(Shift::class)->create([
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
        $user = factory(User::class)->create();
        $timesheet = factory(Timesheet::class)->create([
            'user_id' => $user->id
        ]);
        $shift = factory(Shift::class)->create([
            'timesheet_id' => $timesheet->id
        ]);
        $this->assertNotNull($shift->hours);
    }
}

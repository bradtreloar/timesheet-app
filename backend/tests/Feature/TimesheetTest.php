<?php

namespace Tests\Feature;

use App\Timesheet;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimesheetTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Tests that the timesheet model works.
     *
     * @return void
     */
    public function testDatabase()
    {
        $this->seed();
        $this->assertDatabaseCount('timesheets', 2);
    }

    /**
     * Tests that the timesheet's shift relationship is working.
     */
    public function testShiftsRelationship()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $shifts = $timesheet->shifts;
        $this->assertCount(1, $shifts);
    }
}

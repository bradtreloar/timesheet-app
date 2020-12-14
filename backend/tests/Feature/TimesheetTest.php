<?php

namespace Tests\Feature;

use App\Events\TimesheetCompleted;
use App\Timesheet;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
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
        $this->fakeTimesheetEvents();
        $this->seed();
        $this->assertDatabaseCount('timesheets', 2);
    }

    /**
     * Tests that the timesheet's shift relationship is working.
     */
    public function testShiftsRelationship()
    {
        $this->fakeTimesheetEvents();
        $this->seed();
        $timesheet = Timesheet::first();
        $shifts = $timesheet->shifts;
        $this->assertCount(1, $shifts);
    }

    /**
     * Tests that the TimesheetCompleted event is fired.
     */
    public function testTimesheetCompletedEvent()
    {
        $this->fakeTimesheetEvents();
        $user = factory(User::class)->create();
        $timesheet = factory(Timesheet::class)->create([
            "user_id" => $user->id,
        ]);
        $timesheet->is_completed = true;
        $timesheet->save();
        Event::assertDispatched(TimesheetCompleted::class);
        Event::assertDispatched(function (TimesheetCompleted $event) use ($timesheet) {
            return $event->timesheet->id === $timesheet->id;
        });
    }

    /**
     * Fakes events that are triggered by Timesheet models.
     */
    protected function fakeTimesheetEvents()
    {
        Event::fake([
            TimesheetCompleted::class
        ]);
    }
}

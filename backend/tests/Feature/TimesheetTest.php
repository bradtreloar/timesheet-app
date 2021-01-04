<?php

namespace Tests\Feature;

use App\Events\TimesheetCompleted;
use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Sebdesign\SM\Facade as StateMachine;
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
     * Tests that timesheet state transition.
     */
    public function testTimesheetStateTransition()
    {
        $this->fakeTimesheetEvents();
        $user = User::factory()->create();
        $timesheet = Timesheet::factory()->create([
            "user_id" => $user->id,
        ]);
        $stateMachine = StateMachine::get($timesheet, 'timesheetState');
        $stateMachine->apply('complete');
        $this->assertEquals(Timesheet::STATE_COMPLETED, $timesheet->state);
    }

    /**
     * Tests that the TimesheetCompleted event is fired.
     */
    public function testTimesheetCompletedEvent()
    {
        $this->fakeTimesheetEvents();
        $user = User::factory()->create();
        $timesheet = Timesheet::factory()->create([
            "user_id" => $user->id,
        ]);
        $stateMachine = StateMachine::get($timesheet, 'timesheetState');
        $stateMachine->apply('complete');
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

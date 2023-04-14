<?php

namespace Tests\Feature;

use App\Events\TimesheetCompleted;
use App\Models\Absence;
use App\Models\Shift;
use App\Models\Timesheet;
use App\Models\User;
use Carbon\Carbon;
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
     * Tests that Timesheet::shiftsAndAbsences returns an array of shifts
     * and absences sorted in chronological order.
     */
    public function testgetShiftsAndAbsencesAttribute()
    {
        $user = User::factory()->create();
        $timesheet = Timesheet::factory()->create([
            "user_id" => $user->id,
        ]);
        $shifts_and_absences = [];
        for ($i = 6; $i >= 0; $i--) {
            if (random_int(0, 1)) {
                $shifts_and_absences[] = Shift::factory()->create([
                    'timesheet_id' => $timesheet->id,
                    'start' => Carbon::yesterday()->subDays($i),
                    'end' => Carbon::yesterday()->subDays($i)->addHours(8),
                ]);
            } else {
                $shifts_and_absences[] = Absence::factory()->create([
                    'timesheet_id' => $timesheet->id,
                    'date' => Carbon::yesterday()->subDays($i),
                ]);
            }
        }

        foreach ($timesheet->shifts_and_absences as $index => $shift_or_absence) {
            $this->assertEquals(
                $shift_or_absence->id,
                $shifts_and_absences[$index]->id
            );
            $this->assertEquals(
                get_class($shift_or_absence),
                get_class($shifts_and_absences[$index])
            );
        }
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

<?php

namespace App\Services;

use App\Events\TimesheetCompleted;
use Illuminate\Support\Facades\Event;
use Sebdesign\SM\Event\TransitionEvent;

class TimesheetEventDispatcher
{
    /**
     * Creates the timesheet PDF if it doesn't exist, and returns the filename.
     */
    public static function dispatchCompletedEvent(TransitionEvent $transitionEvent) {
        /**
         * @var \App\Models\Timesheet $timesheet
         */
        $timesheet = $transitionEvent->getStateMachine()->getObject();
        $event = new TimesheetCompleted($timesheet);
        Event::dispatch($event);
    }
}

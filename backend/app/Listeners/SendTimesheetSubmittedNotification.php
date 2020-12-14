<?php

namespace App\Listeners;

use App\Events\TimesheetCompleted;
use App\Mail\TimesheetSubmitted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendTimesheetSubmittedNotification
{
    /**
     * Handle the event.
     *
     * @param  TimesheetCompleted  $event
     * @return void
     */
    public function handle(TimesheetCompleted $event)
    {
        $timesheet = $event->timesheet;
        Mail::to($timesheet->user)->send(new TimesheetSubmitted($timesheet));
    }
}

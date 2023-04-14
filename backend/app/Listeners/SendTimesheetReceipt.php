<?php

namespace App\Listeners;

use App\Events\TimesheetCompleted;
use App\Mail\TimesheetReceipt;
use App\Services\TimesheetPDFWriter;
use Illuminate\Support\Facades\Mail;

class SendTimesheetReceipt
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
        Mail::to($timesheet->user)->send(new TimesheetReceipt($timesheet));
    }
}

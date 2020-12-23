<?php

namespace App\Listeners;

use App\Events\TimesheetCompleted;
use App\Mail\TimesheetNotification;
use App\Models\Setting;
use Illuminate\Support\Facades\Mail;

class SendTimesheetNotification
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
        $recipientsSetting = Setting::where('name', 'timesheetRecipients')->first();
        $recipients = explode(",", $recipientsSetting->value);
        foreach ($recipients as $recipient) {
            Mail::to(trim($recipient))->send(new TimesheetNotification($timesheet));
        }
    }
}

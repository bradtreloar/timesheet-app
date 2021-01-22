<?php

namespace App\Listeners;

use App\Events\TimesheetDue;
use App\Notifications\Reminder;

class SendReminder
{
    /**
     * Handle the event.
     *
     * @param  TimesheetDue  $event
     * @return void
     */
    public function handle(TimesheetDue $event)
    {
        $user = $event->user;
        if ($user->accepts_reminders) {
            $reminder = new Reminder($user);
            $user->notify($reminder);
        }
    }
}

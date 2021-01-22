<?php

namespace App\Notifications;

use App\Channels\SMSChannel;
use App\Contracts\SMSNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class Reminder extends Notification implements SMSNotification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [
            SMSChannel::class
        ];
    }

    /**
     * Get the SMS representation of the notification.
     *
     * @param  mixed $notifiable
     * @return \Illuminate\Notifications\Messages\NexmoMessage
     */
    public function toSMS($notifiable): string
    {
        return 'This is a reminder that you need to submit a timesheet for this week.\n\nRegards, Allbiz Supplies';
    }
}

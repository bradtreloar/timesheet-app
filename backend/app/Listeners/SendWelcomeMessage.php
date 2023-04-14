<?php

namespace App\Listeners;

use App\Events\UserCreated;
use App\Mail\WelcomeMessage;
use Illuminate\Support\Facades\Mail;

class SendWelcomeMessage
{
    /**
     * Handle the event.
     *
     * @param  UserCreated  $event
     * @return void
     */
    public function handle(UserCreated $event)
    {
        $user = $event->user;
        Mail::to($user)->send(new WelcomeMessage($user));
    }
}

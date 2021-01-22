<?php

namespace App\Contracts;

interface SMSNotification
{
    public function toSMS($notifiable): string;
}

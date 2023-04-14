<?php

namespace App\Channels;

use App\Contracts\SMSNotification;
use GuzzleHttp\Client;

class SMSChannel
{
    public function __construct()
    {
        $this->username = config('sms.username');
        $this->password = config('sms.password');
        $this->from = config('sms.from');
    }
    /**
     * Send the given notification.
     *
     * @param  mixed  $notifiable
     * @param  \App\Contracts\SMSNotification $notification
     * @return void
     */
    public function send($notifiable, SMSNotification $notification)
    {
        $message = $notification->toSMS($notifiable);
        $to = $notifiable->routeNotificationForSMS($notification);
        if ($to) {
            $client = new Client();
            $client->post("https://api.smsbroadcast.com.au/api-adv.php", [
                'query' => [
                    'username' => $this->username,
                    'password' => $this->password,
                    'to' => $to,
                    'from' => $this->from,
                    'message' => $message,
                ],
            ]);
        }
    }
}

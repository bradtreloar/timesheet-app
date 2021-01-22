<?php

return [
    'username' => env('SMSBROADCAST_USERNAME', env('APP_NAME', 'Laravel')),
    'password' => env('SMSBROADCAST_PASSWORD'),
    'from' => env('SMSBROADCAST_FROM'),
];

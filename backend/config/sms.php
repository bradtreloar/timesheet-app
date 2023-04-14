<?php

return [
    'username' => env('SMSBROADCAST_USERNAME'),
    'password' => env('SMSBROADCAST_PASSWORD'),
    'from' => env('SMSBROADCAST_FROM', env('APP_NAME', 'Laravel')),
];

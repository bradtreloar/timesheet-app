<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Shift;
use Faker\Generator as Faker;

$factory->define(Shift::class, function (Faker $faker) {

    return [
        'date' => $faker->date(),
        'start_at' => '09:30:00',
        'end_at' => '17:30:00',
        'break_duration' => '00:45:00',
        'status' => 'worked',
    ];
});

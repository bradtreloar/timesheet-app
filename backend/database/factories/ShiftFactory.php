<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Shift;
use Faker\Generator as Faker;

$factory->define(Shift::class, function (Faker $faker) {

    return [
        'start' => $faker->date(),
        'end' => $faker->date(),
        'break_duration' => 45,
    ];
});

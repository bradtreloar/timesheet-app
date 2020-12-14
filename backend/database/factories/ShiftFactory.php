<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Shift;
use Carbon\Carbon;
use Faker\Generator as Faker;

$factory->define(Shift::class, function (Faker $faker) {
    $start = Carbon::yesterday();
    $end = Carbon::yesterday()->addHours(8);

    return [
        'start' => $start,
        'end' => $end,
        'break_duration' => 45,
    ];
});

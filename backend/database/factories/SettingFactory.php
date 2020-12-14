<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Setting;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

$factory->define(Setting::class, function (Faker $faker) {
    return [
        'name' => Str::random(),
        'value' => Str::random(),
        'is_restricted' => false,
    ];
});

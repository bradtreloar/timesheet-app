<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Faker\Generator as Faker;

class FakerServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Faker::class, function ($app) {
            $faker = \Faker\Factory::create();
            $newClass = new class($faker) extends \Faker\Provider\Base {
                public function defaultShifts()
                {
                    $default_shifts = [];
                    for ($i = 0; $i < 7; $i++) {
                        $default_shifts[] = [
                            "isActive" => true,
                            "start" => [
                                "hours" => random_int(0, 8),
                                "minutes" => random_int(0, 59),
                            ],
                            "end" => [
                                "hours" => random_int(16, 23),
                                "minutes" => random_int(0, 59),
                            ],
                            "breakDuration" => [
                                "hours" => random_int(0, 1),
                                "minutes" => random_int(0, 59),
                            ],
                        ];
                    }
                    return json_encode($default_shifts);
                }
            };

            $faker->addProvider($newClass);
            return $faker;
        });
    }
}

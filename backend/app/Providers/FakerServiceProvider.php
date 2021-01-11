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
                    $default_values = [];
                    for ($i = 0; $i < 7; $i++) {
                        $default_values[] = [
                            "isActive" => true,
                            "startTime" => [
                                "hour" => (string) random_int(0, 8),
                                "minute" => (string) random_int(0, 59),
                            ],
                            "endTime" => [
                                "hour" => (string) random_int(16, 23),
                                "minute" => (string) random_int(0, 59),
                            ],
                            "breakDuration" => [
                                "hour" => (string) random_int(0, 1),
                                "minute" => (string) random_int(0, 59),
                            ],
                        ];
                    }
                    return json_encode($default_values);
                }
            };

            $faker->addProvider($newClass);
            return $faker;
        });
    }
}

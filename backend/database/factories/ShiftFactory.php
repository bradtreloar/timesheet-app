<?php

namespace Database\Factories;

use App\Models\Shift;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShiftFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Shift::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $start = Carbon::yesterday();
        $end = Carbon::yesterday()->addHours(8);

        return [
            'start' => $start,
            'end' => $end,
            'break_duration' => 45,
        ];
    }
}

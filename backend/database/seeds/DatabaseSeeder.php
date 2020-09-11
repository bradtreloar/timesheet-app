<?php

use App\Shift;
use App\Timesheet;
use App\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Create two users, each with one timesheet with a single shift.
        for ($i = 0; $i < 2; $i++) {
            $user = factory(User::class)->create();

            $timesheet = factory(Timesheet::class)->create([
                'user_id' => $user->id,
            ]);

            $shift = factory(Shift::class)->create([
                'timesheet_id' => $timesheet->id,
            ]);
        }
    }
}

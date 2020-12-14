<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\Shift;
use App\Models\Timesheet;
use App\Models\User;
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
            $user = User::factory()->create();

            $timesheet = Timesheet::factory()->create([
                'user_id' => $user->id,
            ]);

            $shift = Shift::factory()->create([
                'timesheet_id' => $timesheet->id,
            ]);
        }

        Setting::create([
            'name' => 'startOfWeek',
            'value' => '0',
            'is_restricted' => false,
        ]);

        Setting::create([
            'name' => 'timesheetRecipients',
            'value' => 'admin@example.com',
            'is_restricted' => true,
        ]);
    }
}

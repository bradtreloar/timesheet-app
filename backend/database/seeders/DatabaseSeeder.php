<?php

namespace Database\Seeders;

use App\Models\Absence;
use App\Models\Setting;
use App\Models\Shift;
use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

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

            Shift::factory()->create([
                'timesheet_id' => $timesheet->id,
            ]);

            Absence::factory()->create([
                'timesheet_id' => $timesheet->id,
            ]);
        }

        $timesheetRecipients = [];
        $timesheetRecipients[] = Str::random(10) . '@example.com';
        $timesheetRecipients[] = Str::random(10) . '@example.com';
        Setting::create([
            'name' => 'timesheetRecipients',
            'value' => implode(",", $timesheetRecipients),
            'is_restricted' => true,
        ]);
    }
}

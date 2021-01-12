<?php

namespace App\Console\Commands;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;

class AppInstall extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:install
                            {--timesheet-recipients=timesheet@example.com}
                            {--admin-email=admin@example.com}
                            {--admin-name=admin}
                            {--admin-pass=admin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialise the site with admin user and settings.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $default_values = [];
        for ($i = 0; $i < 7; $i++) {
            $default_values[] = [
                "isActive" => false,
                "reason" => "rostered-day-off",
                "startTime" => [
                    "hour" => "",
                    "minute" => "",
                ],
                "endTime" => [
                    "hour" => "",
                    "minute" => "",
                ],
                "breakDuration" => [
                    "hour" => "",
                    "minute" => "",
                ],
            ];
        }

        try {
            $user = new User([
                "name" => $this->option("admin-name"),
                "email" => $this->option("admin-email"),
                'is_admin' => true,
                'default_values' => json_encode($default_values),
            ]);
            $user->password = Hash::make($this->option("admin-pass"));
            $user->markEmailAsVerified();
            $user->save();
            return 0;
        } catch (QueryException $ex) {
            print("Unable to create user.\n");
            return 1;
        }

        try {
            $setting = new Setting([
                "name" => "timesheetRecipients",
                "value" => $this->option("timesheet-recipients"),
            ]);
            $setting->save();
            return 0;
        } catch (QueryException $ex) {
            print("Unable to create user.\n");
            return 1;
        }
    }
}

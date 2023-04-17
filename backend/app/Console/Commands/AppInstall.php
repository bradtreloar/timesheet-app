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
        try {
            $this->createAdminUser(
                $this->option('admin-name'),
                $this->option('admin-email'),
                $this->option('admin-pass'),
                $this->getUserDefaultValues()
            );
        } catch (QueryException $ex) {
            print("Unable to create admin user.\n{$ex->getMessage()}\n");
            return 1;
        }

        try {
            $this->setTimesheetRecipients(
                $this->option('timesheet-recipients')
            );
        } catch (QueryException $ex) {
            print("Unable to set timesheet recipients.\n{$ex->getMessage()}\n");
            return 1;
        }

        return 0;
    }

    protected function getUserDefaultValues()
    {
        $default_values = [];
        for ($i = 0; $i < 7; $i++) {
            $default_values[] = [
                'isActive' => false,
                'reason' => 'rostered-day-off',
                'startTime' => [
                    'hour' => '',
                    'minute' => '',
                ],
                'endTime' => [
                    'hour' => '',
                    'minute' => '',
                ],
                'breakDuration' => [
                    'hour' => '',
                    'minute' => '',
                ],
            ];
        }

        return $default_values;
    }

    protected function createAdminUser(string $name, string $email, string $password, array $default_values)
    {
        $user = new User([
            'name' => $name,
            'email' => $email,
            'is_admin' => true,
            'default_values' => json_encode($default_values),
        ]);
        $user->password = Hash::make($password);
        $user->markEmailAsVerified();
        $user->save();
    }

    protected function setTimesheetRecipients(string $timesheetRecipients)
    {
        $setting = new Setting();
        $setting->name = 'timesheetRecipients';
        $setting->value = $timesheetRecipients;
        $setting->is_restricted = true;
        $setting->save();
    }
}
<?php

namespace App\Console\Commands;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;

class SetTimesheetRecipients extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'set:timesheet-recipients {recipients*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set the timesheet recipients.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $recipients = implode(",", $this->argument("recipients"));

        try {
            if ($setting = Setting::where('name', 'timesheetRecipients')->first()) {
                $setting->value = $recipients;
                $setting->save();
            } else {
                $setting = new Setting();
                $setting->name = 'timesheetRecipients';
                $setting->value = $recipients;
                $setting->is_restricted = true;
                $setting->save();
            }
            return 0;
        } catch (QueryException $ex) {
            print("Unable to set timesheet recipients.\n");
            return 1;
        }
    }
}

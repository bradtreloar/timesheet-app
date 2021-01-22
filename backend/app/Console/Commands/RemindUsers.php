<?php

namespace App\Console\Commands;

use App\Events\TimesheetDue;
use App\Models\Setting;
use App\Models\Timesheet;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;

class RemindUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remind:users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders to users who haven\'t submitted a timesheet for the current week.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = User::all();
        foreach ($users as $user) {
            if (!$this->userHasCurrentTimesheet($user)) {
                Event::dispatch(new TimesheetDue($user));
            }
        }
    }

    /**
     * Check every timesheet for a shift or absence set in the future.
     */
    public function userHasCurrentTimesheet($user)
    {
        $timesheets = Timesheet::where([
            'user_id' => $user->id,
        ])->get();
        if ($timesheets) {
            foreach ($timesheets as $timesheet) {
                $shifts = $timesheet->shifts;
                foreach ($shifts as $shift) {
                    if ($shift->start->diffInDays(null, false) <= 0) {
                        return true;
                    }
                }
                $absences = $timesheet->absences;
                foreach ($absences as $absence) {
                    if ($absence->date->diffInDays(null, false) <= 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

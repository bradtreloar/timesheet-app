<?php

namespace App\Console\Commands;

use App\Models\Absence;
use App\Models\Shift;
use App\Models\Timesheet;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Sebdesign\SM\Facade as StateMachine;

class FakeTimesheet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fake:timesheet {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create and submit a fake timesheet for the user with given email address.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            $user = User::where('email', $this->argument("email"))->first();
            $timesheet = Timesheet::factory()->create([
                'user_id' => $user->id,
            ]);
            for ($i = 0; $i < 7; $i++) {
                if (random_int(0, 1)) {
                    Shift::factory()->create([
                        'timesheet_id' => $timesheet->id,
                        'start' => Carbon::yesterday()->startOfWeek()->addDays($i),
                        'end' => Carbon::yesterday()->startOfWeek()->addDays($i)->addHours(8),
                    ]);
                } else {
                    Absence::factory()->create([
                        'timesheet_id' => $timesheet->id,
                        'date' => Carbon::yesterday()->startOfWeek()->addDays($i),
                    ]);
                }
            }
            $timesheet->save();
            $stateMachine = StateMachine::get($timesheet, 'timesheetState');
            $stateMachine->apply('complete');
            $timesheet->save();
            return 0;
        } catch (QueryException $ex) {
            print("Unable to create timesheet.\n{$ex->getMessage()}\n");
            return 1;
        }
    }
}
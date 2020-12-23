<?php

namespace App\Http\Controllers;

use App\Http\Responses\NoContentResponse;
use App\Models\Timesheet;
use Illuminate\Http\Request;
use Sebdesign\SM\Facade as StateMachine;

class TimesheetController extends Controller
{
    /**
     * Set the timesheet to completed.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Timesheet  $timesheet
     * @return \Illuminate\Http\Response
     */
    public function complete(Request $request, Timesheet $timesheet)
    {
        $user = $request->user();
        if ($user->can('update', $timesheet)) {
            $stateMachine = StateMachine::get($timesheet, 'timesheetState');
            $stateMachine->apply('complete');
            $timesheet->save();
            return new NoContentResponse();
        }

        abort(401);
    }
}

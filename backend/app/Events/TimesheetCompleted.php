<?php

namespace App\Events;

use App\Models\Timesheet;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TimesheetCompleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var Timesheet
     */
    public $timesheet;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Timesheet $timesheet)
    {
        $this->timesheet = $timesheet;
    }
}

<?php

namespace App\Mail;

use App\Models\Timesheet;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TimesheetSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var Timesheet
     */
    public $timesheet;

    /**
     * Create a new message instance.
     *
     * @param Timesheet $timesheet
     *   The timesheet to display in the message.
     *
     * @return void
     */
    public function __construct(Timesheet $timesheet)
    {
        $this->timesheet = $timesheet;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.timesheet');
    }
}

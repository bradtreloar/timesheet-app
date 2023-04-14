<?php

namespace App\Mail;

use App\Models\Timesheet;
use App\Services\TimesheetPDF;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TimesheetReceipt extends Mailable
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
        $attachment_path = TimesheetPDF::create($this->timesheet);
        return $this
            ->subject("Your timesheet has been submitted")
            ->markdown('mail.timesheet')
            ->attach($attachment_path);
    }
}

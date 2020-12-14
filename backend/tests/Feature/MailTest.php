<?php

namespace Tests\Feature;

use App\Mail\TimesheetSubmitted;
use App\Timesheet;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MailTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Tests that the timesheet submitted notification is sent to the user
     *
     * @return void
     */
    public function testTimesheetSubmittedNotificationSent()
    {
        Mail::fake();
        $user = factory(User::class)->create();
        $timesheet = factory(Timesheet::class)->create([
            'user_id' => $user->id,
        ]);
        $timesheet->is_completed = true;
        $timesheet->save();
        Mail::assertSent(function (TimesheetSubmitted $mail) use ($timesheet) {
            return $mail->timesheet->id === $timesheet->id &&
                   $mail->hasTo($timesheet->user);
        });
    }

    /**
     * Tests that the timesheet submitted notification renders correctly.
     *
     * @return void
     */
    public function testTimesheetSubmittedNotificationRenders()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $html_output = (new TimesheetSubmitted($timesheet))->render();
        $this->assertStringContainsString("Timesheet Submitted", $html_output);
        $this->assertStringContainsString($timesheet->user->name, $html_output);
        $this->assertStringContainsString($timesheet->created_at->toString(), $html_output);
        foreach ($timesheet->shifts as $shift) {
            $this->assertStringContainsString($shift->start->toString(), $html_output);
            $this->assertStringContainsString($shift->end->toString(), $html_output);
            $this->assertStringContainsString($shift->break_duration, $html_output);
            $this->assertStringContainsString($shift->hours, $html_output);
        }
    }
}

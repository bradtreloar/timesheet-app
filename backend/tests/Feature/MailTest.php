<?php

namespace Tests\Feature;

use App\Mail\TimesheetNotification;
use App\Mail\TimesheetReceipt;
use App\Mail\WelcomeMessage;
use App\Models\Setting;
use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Mail;
use Sebdesign\SM\Facade as StateMachine;
use Tests\TestCase;

class MailTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    public function testWelcomeMessageSent()
    {
        Mail::fake();
        $user = User::factory()->create();
        Mail::assertSent(function (WelcomeMessage $mail) use ($user) {
            return $mail->user->id === $user->id &&
                   $mail->hasTo($user);
        });
    }

    /**
     * Tests that the timesheet submitted notification renders correctly.
     *
     * @return void
     */
    public function testWelcomeMessageRenders()
    {
        $this->seed();
        $user = User::factory()->create();
        $html_output = (new WelcomeMessage($user))->render();
        $this->assertStringContainsString("Welcome", $html_output);
        $this->assertStringContainsString("A user account has been created for you", $html_output);
    }

    /**
     * Tests that the timesheet receipt is sent to the user
     *
     * @return void
     */
    public function testTimesheetReceiptSent()
    {
        Mail::fake();
        $this->seed();
        $timesheet = Timesheet::first();
        $stateMachine = StateMachine::get($timesheet, 'timesheetState');
        $stateMachine->apply('complete');
        Mail::assertSent(function (TimesheetReceipt $mail) use ($timesheet) {
            return $mail->timesheet->id === $timesheet->id &&
                   $mail->hasTo($timesheet->user);
        });
    }

    /**
     * Tests that the timesheet notification is sent to the addresses defined
     * in settings.
     *
     * @return void
     */
    public function testTimesheetNotificationSent()
    {
        Mail::fake();
        $this->seed();
        $timesheet = Timesheet::first();
        $stateMachine = StateMachine::get($timesheet, 'timesheetState');
        $stateMachine->apply('complete');
        $recipientsSetting = Setting::where('name', 'timesheetRecipients')->first();
        $recipients = explode(",", $recipientsSetting->value);
        foreach ($recipients as $recipient) {
            Mail::assertSent(function (TimesheetNotification $mail) use ($timesheet, $recipient) {
                return $mail->timesheet->id === $timesheet->id &&
                       $mail->hasTo($recipient);
            });
        }
    }

    /**
     * Tests that the timesheet submitted notification renders correctly.
     *
     * @return void
     */
    public function testTimesheetNotificationRenders()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $user = $timesheet->user;
        $html_output = (new TimesheetNotification($timesheet))->render();
        $this->assertStringContainsString("Timesheet Submitted", $html_output);
        $this->assertStringContainsString($user->name, $html_output);
        $this->assertStringContainsString($timesheet->created_at->toString(), $html_output);
        foreach ($timesheet->shifts as $shift) {
            $this->assertStringContainsString($shift->start->toString(), $html_output);
            $this->assertStringContainsString($shift->end->toString(), $html_output);
            $this->assertStringContainsString($shift->break_duration, $html_output);
            $this->assertStringContainsString($shift->hours, $html_output);
        }
    }
}

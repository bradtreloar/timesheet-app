<?php

namespace Tests\Feature;

use App\Console\Commands\RemindUsers;
use App\Events\TimesheetDue;
use App\Models\Shift;
use App\Models\Timesheet;
use App\Models\User;
use App\Notifications\Reminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ReminderTest extends TestCase
{
    use RefreshDatabase;

    public function testUserHasCurrentTimesheet()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $user = $timesheet->user;
        $today_shift = Shift::factory()->create([
            'timesheet_id' => $timesheet->id,
            'start' => Carbon::today()->subDays(7),
            'end' => Carbon::today()->subDays(7)->addHours(8),
        ]);
        $command = new RemindUsers();
        $this->assertTrue($command->userHasCurrentTimesheet($user));
    }

    public function testSendNotification()
    {
        Notification::fake();
        $this->seed();
        $user = User::first();
        Event::dispatch(new TimesheetDue($user));
        Notification::assertSentTo($user, Reminder::class);
    }
}

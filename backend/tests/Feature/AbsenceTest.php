<?php

namespace Tests\Feature;

use App\Models\Absence;
use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AbsenceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Tests that the absence model works.
     *
     * @return void
     */
    public function testDatabase()
    {
        $user = User::factory()->create();
        $timesheet = Timesheet::factory()->create([
            'user_id' => $user->id
        ]);
        $absence = Absence::factory()->create([
            'timesheet_id' => $timesheet->id
        ]);
        $this->assertInstanceOf(
            Timesheet::class,
            $absence->timesheet()->getResults()
        );
        $this->assertDatabaseCount($absence->getTable(), 1);
        $absence->delete();
        $this->assertDeleted($absence);
    }
}

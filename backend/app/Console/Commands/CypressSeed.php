<?php

namespace App\Console\Commands;

use App\Models\Absence;
use App\Models\Setting;
use App\Models\Shift;
use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AppInstall extends Command
{
    protected $signature = 'cypress:seed {json : The fixtures data}';

    protected $description = 'Seed the database with test fixtures.';

    protected static $modelClasses = [
        'users' => User::class,
        'timesheets' => Timesheet::class,
        'shifts' => Shift::class,
        'absences' => Absence::class,
        'settings' => Setting::class,
    ];

    public function handle(): int
    {
        $fixtures = json_decode($this->argument('json'), true);

        foreach (self::$modelClasses as $modelKey => $modelClass) {
            if (array_key_exists($modelKey, $fixtures)) {
                $this->createRecords($modelClass, $fixtures[$modelKey]);
            }
        }

        return 0;
    }

    protected function createRecords(string $modelClass, array $fixtures)
    {
        foreach ($fixtures as $fixture) {
            $attributes = $this->getSnakeCaseAttributes($fixture);
            $modelClass::factory()->create($attributes);
        }
    }

    protected function getFixtures(): array
    {
        $raw = Storage::disk('local')->get('cypress/fixtures/database.json');
        return json_decode($raw);
    }

    protected function getSnakeCaseAttributes(array $values): array
    {
        $attributes = [];
        foreach ($values as $key => $value) {
            $attributes[Str::snake($key)] = $value;
        }
        return $attributes;
    }
}
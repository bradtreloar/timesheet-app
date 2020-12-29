<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tests\TestCase;

class JsonApiTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $defaultHeaders = [
        "Origin" => "localhost",
    ];

    /**
     * {@inheritdoc}
     */
    public function setUp(): void
    {
        parent::setUp();
        Mail::fake();
    }

    /**
     * Call the given URI with a JSON:API request.
     *
     * @param  string  $method
     * @param  string  $uri
     * @param  array  $data
     * @param  array  $headers
     * @return \Illuminate\Testing\TestResponse
     */
    public function jsonApi($method, $uri, array $data = [], array $headers = [])
    {
        $headers = array_merge([
            "Content-Type" => "application/vnd.api+json",
            "Accept" => "application/vnd.api+json",
        ], $headers);

        return parent::json($method, $uri, $data, $headers);
    }

    /**
     * Creates a timesheet data array.
     *
     * @param User $user
     *   The timesheet's owner.
     *
     * @return array
     *   The timesheet data.
     */
    protected function fakeTimesheetData(User $user): array
    {
        return  [
            "type" => "timesheets",
            "attributes" => [
                "comment" => Str::random(),
            ],
            "relationships" => [
                "user" => [
                    "data" => [
                        "type" => "users",
                        "id" => "{$user->id}",
                    ]
                ],
            ],
        ];
    }

    /**
     * Creates a shift data array.
     *
     * @param Timesheet $timesheet
     *   The shift's timesheet.
     *
     * @return array
     *   The shift data.
     */
    protected function fakeShiftData(Timesheet $timesheet): array
    {
        return [
            "type" => "shifts",
            "attributes" => [
                "start" => $this->faker->iso8601(),
                "end" => $this->faker->iso8601(),
                "break_duration" => 45,
            ],
            "relationships" => [
                "timesheet" => [
                    "data" => [
                        "type" => "timesheets",
                        "id" => "{$timesheet->id}",
                    ]
                ],
            ],
        ];
    }

    public function testCreateUser()
    {
        $this->seed();
        $this->assertDatabaseCount('users', 2);
        $user = User::factory()->make();

        $request_data = [
            "data" => [
                "type" => "users",
                "attributes" => [
                    "name" => $user->name,
                    "email" => $user->email,
                    "password" => $user->password,
                    "is_admin" => $user->is_admin,
                    "default_shifts" => $user->default_shifts,
                ],
            ],
        ];

        $response = $this->actingAs($user)
            ->jsonApi("POST", "/users", $request_data);
        $response->assertStatus(201);
        $response->assertJson([
            "data" => [
                "type" => "users",
                "id" => "3",
            ]
        ]);

        $this->assertDatabaseCount('users', 3);
    }

    public function testFetchUnrestrictedSettings()
    {
        $this->seed();
        $user = User::find(1);
        $settings = Setting::where('is_restricted', false)->get();
        $this->assertCount(1, $settings);
        $response = $this->actingAs($user)
            ->jsonApi("GET", "/settings?filter[is_restricted]=0");
        $response->assertStatus(200);
        $this->assertCount(1, $response->json("data"));
        foreach ($settings as $setting) {
            $response->assertJson([
                'data' => [
                    [
                        "attributes" => [
                            "name" => $setting->name,
                            "value" => $setting->value,
                        ]
                    ]
                ]
            ]);
        }
    }

    public function testFetchAllSettings()
    {
        $this->seed();
        $user = User::find(1);
        $user->is_admin = true;
        $user->save();
        $settings = Setting::all();
        $response = $this->actingAs($user)->jsonApi("GET", "/settings");
        $response->assertStatus(200);
        $this->assertCount(2, $response->json("data"));
        foreach ($settings as $index => $setting) {
            $response->assertJson([
                'data' => [
                    $index => [
                        "attributes" => [
                            "name" => $setting->name,
                            "value" => $setting->value,
                        ]
                    ]
                ]
            ]);
        }
    }

    public function testUpdateSetting()
    {
        $this->seed();
        $user = User::find(1);
        $user->is_admin = true;
        $user->save();
        $setting = Setting::where("name", "startOfWeek")->first();
        $sid = $setting->id;
        $request_data = [
            "data" => [
                "id" => (string) $sid,
                "type" => "settings",
                "attributes" => [
                    "value" => "5",
                ],
            ],
        ];
        $response = $this->actingAs($user)
            ->jsonApi("PATCH", "/settings/{$setting->id}", $request_data);
        $response->assertStatus(200);
        $setting = Setting::find($sid);
        $this->assertEquals("5", $setting->value);
    }

    public function testFetchTimesheet()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $user = $timesheet->user;
        $response = $this->actingAs($user)
            ->jsonApi("GET", "/timesheets/{$timesheet->id}");
        $response->assertStatus(200);
        $response->assertJson([
            "data" => [
                "id" => "1",
            ],
        ]);
    }

    public function testFetchTimesheetWithShifts()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $user = $timesheet->user;
        $response = $this->actingAs($user)
            ->jsonApi("GET", "/timesheets/{$timesheet->id}?include=shifts");
        $response->assertStatus(200);
        $id = $response->json("data.id");
        $this->assertEquals("1", $id);
        $shifts = $response->json("included");
        $this->assertIsArray($shifts);
        $this->assertEquals(1, count($shifts));
    }

    public function testDenyFetchAllTimesheets()
    {
        $this->seed();
        $user = User::find(1);
        $response = $this->actingAs($user)
            ->jsonApi("GET", "/timesheets");
        $response->assertStatus(403);
    }

    public function testDenyFetchTimesheetForOtherUser()
    {
        $this->seed();
        $timesheet = Timesheet::find(1);
        $user = $timesheet->user;
        // Try to retrieve timesheet that doesn"t belong to user.
        $timesheet = Timesheet::find(2);
        $this->assertEquals(2, $timesheet->id);
        $response = $this->actingAs($user)
            ->get("/timesheets/{$timesheet->id}");
        $response->assertStatus(403);
    }

    public function testFetchAllTimesheetsForUser()
    {
        $this->seed();
        $user = User::first();
        $response = $this->actingAs($user)
            ->jsonApi("GET", "/users/{$user->id}/timesheets");
        $response->assertStatus(200);
        $data = $response->json("data");
        $this->assertEquals(1, count($data));
    }

    public function testDenyFetchAllTimesheetsForOtherUser()
    {
        $this->seed();
        $user = User::find(1);
        $other_user = User::find(2);
        $response = $this->actingAs($user)
            ->jsonApi("GET", "/users/{$other_user->id}/timesheets");
        $response->assertStatus(403);
    }

    public function testCreateTimesheet()
    {
        $this->seed();
        $user = User::first();
        $request_data = [
            "data" => $this->fakeTimesheetData($user),
        ];
        $response = $this->actingAs($user)
            ->jsonApi("POST", "/timesheets", $request_data);
        $response->assertStatus(201);
        $response->assertJson([
            "data" => [
                "type" => "timesheets",
                "id" => "3",
            ]
        ]);
        $this->assertDatabaseCount("timesheets", 3);
    }

    public function testDenyCreateTimesheetForOtherUser()
    {
        $this->seed();
        $user = User::find(1);
        $other_user = User::find(2);
        $request_data = [
            "data" => $this->fakeTimesheetData($other_user),
        ];
        $response = $this->actingAs($user)
            ->jsonApi("POST", "/timesheets", $request_data);
        $response->assertStatus(403);
        $this->assertDatabaseCount("timesheets", 2);
    }

    public function testDeleteTimesheet()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $user = $timesheet->user;

        $response = $this->actingAs($user)
            ->jsonApi("DELETE", "/timesheets/{$timesheet->id}");

        $response->assertStatus(204);
        $this->assertDatabaseCount("timesheets", 1);
    }

    public function testDenyDeleteTimesheetForOtherUser()
    {
        $this->seed();
        $timesheet = Timesheet::find(1);
        $other_timesheet = Timesheet::find(2);
        $user = $timesheet->user;

        $response = $this->actingAs($user)
            ->jsonApi("DELETE", "/timesheets/{$other_timesheet->id}");

        $response->assertStatus(403);
        $this->assertDatabaseCount("timesheets", 2);
    }

    public function testCreateShift()
    {
        $this->seed();
        $timesheet = Timesheet::find(1);
        $user = $timesheet->user;
        $request_data = [
            "data" => $this->fakeShiftData($timesheet),
        ];
        $response = $this->actingAs($user)
            ->jsonApi("POST", "/shifts", $request_data);
        $response->assertStatus(201);
        $response->assertJson([
            "data" => [
                "type" => "shifts",
                "id" => "3",
            ]
        ]);
        $this->assertDatabaseCount("shifts", 3);
    }

    public function testCreateMultipleShifts()
    {
        $this->seed();
        $timesheet = Timesheet::find(1);
        $user = $timesheet->user;
        for ($i = 0; $i < 5; $i++) {
            $request_data = [
                "data" => $this->fakeShiftData($timesheet),
            ];
            $response = $this->actingAs($user)
                ->jsonApi("POST", "/shifts", $request_data);
            $response->assertStatus(201);
            $response->assertJson([
                "data" => [
                    "type" => "shifts",
                ]
            ]);
        }
        $this->assertDatabaseCount("shifts", 7);
        $this->assertCount(6, $timesheet->shifts);
    }
}

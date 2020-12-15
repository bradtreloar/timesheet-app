<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\Timesheet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

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
                "is_completed" => false
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


    public function testSuccessfulLoginAttempt()
    {
        $plain_password = $this->faker()->password();
        $user = User::factory()->create([
            'password' => Hash::make($plain_password),
        ]);
        $request_data = [
            'email' => $user->email,
            'password' => $plain_password,
        ];
        $response = $this->postJson("/api/login", $request_data);
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals([
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'is_admin' => $user->is_admin,
        ], $data);
    }


    public function testFailedLoginAttempt()
    {
        $plain_password = $this->faker()->password();
        $user = User::factory()->create([
            'password' => Hash::make($plain_password),
        ]);
        $incorrect_password = $plain_password . "!";
        $request_data = [
            'email' => $user->email,
            'password' => $incorrect_password,
        ];
        $response = $this->postJson("/api/login", $request_data);
        $response->assertStatus(422);
    }


    public function testFetchCurrentUser()
    {
        $this->seed();
        $user = User::find(1);
        $response = $this->actingAs($user)->getJson("/api/user");
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals([
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'is_admin' => $user->is_admin,
        ], $data);
    }


    public function testForgotPassword()
    {
        $this->seed();
        $user = User::find(1);
        $response = $this->actingAs($user)->postJson("/api/forgot-password", [
            'email' => $user->email,
        ]);
        $response->assertStatus(204);
    }


    public function testFetchUnrestrictedSettings()
    {
        $this->seed();
        $user = User::find(1);
        $settings = Setting::where('is_restricted', false)->get();
        $this->assertCount(1, $settings);
        $response = $this->actingAs($user)->jsonApi("GET", "/api/settings?filter[is_restricted]=0");
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
        $response = $this->actingAs($user)->jsonApi("GET", "/api/settings");
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
            ->jsonApi("PATCH", "/api/settings/{$setting->id}", $request_data);
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
            ->jsonApi("GET", "/api/timesheets/{$timesheet->id}");
        $response->assertStatus(200);
        $response->assertJson([
            "data" => [
                "id" => "1",
                "attributes" => [
                    "is_completed" => false,
                ],
            ],
        ]);
    }


    public function testFetchTimesheetWithShifts()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $user = $timesheet->user;
        $response = $this->actingAs($user)
            ->jsonApi("GET", "/api/timesheets/{$timesheet->id}?include=shifts");
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
            ->jsonApi("GET", "/api/timesheets");
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
            ->get("/api/timesheets/{$timesheet->id}");
        $response->assertStatus(403);
    }


    public function testFetchAllTimesheetsForUser()
    {
        $this->seed();
        $user = User::first();
        $response = $this->actingAs($user)
            ->jsonApi("GET", "/api/users/{$user->id}/timesheets");
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
            ->jsonApi("GET", "/api/users/{$other_user->id}/timesheets");
        $response->assertStatus(403);
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
            ->jsonApi("POST", "/api/users", $request_data);
        $response->assertStatus(201);
        $response->assertJson([
            "data" => [
                "type" => "users",
                "id" => "3",
            ]
        ]);

        $this->assertDatabaseCount('users', 3);
    }


    public function testCreateTimesheet()
    {
        $this->seed();
        $user = User::first();
        $request_data = [
            "data" => $this->fakeTimesheetData($user),
        ];
        $response = $this->actingAs($user)
            ->jsonApi("POST", "/api/timesheets", $request_data);
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
            ->jsonApi("POST", "/api/timesheets", $request_data);
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
            ->jsonApi("POST", "/api/shifts", $request_data);
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
                ->jsonApi("POST", "/api/shifts", $request_data);
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


    public function testDeleteTimesheet()
    {
        $this->seed();
        $timesheet = Timesheet::first();
        $user = $timesheet->user;

        $response = $this->actingAs($user)
            ->jsonApi("DELETE", "/api/timesheets/{$timesheet->id}");

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
            ->jsonApi("DELETE", "/api/timesheets/{$other_timesheet->id}");

        $response->assertStatus(403);
        $this->assertDatabaseCount("timesheets", 2);
    }


    public function testUpdateTimesheet()
    {
        $this->seed();
        $timesheet = Timesheet::find(1);
        $user = $timesheet->user;
        $response = $this->actingAs($user)
            ->jsonApi("GET", "/api/timesheets/{$timesheet->id}");
        $data = $response->json("data");
        $data["attributes"]["is_completed"] = true;
        unset($data["relationships"]);
        $request_data = [
            "data" => $data,
        ];
        $response = $this->actingAs($user)
            ->jsonApi("PATCH", "/api/timesheets/{$timesheet->id}", $request_data);
        $response->assertStatus(200);
        $timesheet = Timesheet::find(1);
        $this->assertTrue($timesheet->is_completed);
    }
}

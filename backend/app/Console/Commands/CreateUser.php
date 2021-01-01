<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;

class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:user {email} {name} {password} {--admin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $plain_password = $this->argument("password");

        $default_shifts = [];
        for ($i = 0; $i < 7; $i++) {
            $default_shifts[] = [
                "isActive" => true,
                "startTime" => [
                    "hours" => 9,
                    "minutes" => 0,
                ],
                "endTime" => [
                    "hours" => 17,
                    "minutes" => 0,
                ],
                "breakDuration" => [
                    "hours" => 0,
                    "minutes" => 30,
                ],
            ];
        }

        try {
            $user = new User([
                "name" => $this->argument("name"),
                "email" => $this->argument("email"),
                "password" => Hash::make($plain_password),
                'is_admin' => $this->option("admin"),
                'default_shifts' => json_encode($default_shifts),
            ]);
            $user->markEmailAsVerified();
            $user->save();
            return 0;
        } catch (QueryException $ex) {
            print("Unable to create user.\n");
            return 1;
        }
    }
}

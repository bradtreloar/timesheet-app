<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;

class UserCreate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create {email} {name} {--admin}';

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
        $default_shifts = [];
        for ($i = 0; $i < 7; $i++) {
            $default_shifts[] = [
                "isActive" => true,
                "startTime" => [
                    "hour" => "9",
                    "minutes" => "0",
                ],
                "endTime" => [
                    "hour" => "17",
                    "minute" => "0",
                ],
                "breakDuration" => [
                    "hour" => "0",
                    "minute" => "30",
                ],
            ];
        }

        try {
            $user = new User([
                "name" => $this->argument("name"),
                "email" => $this->argument("email"),
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

<?php

namespace App\Console\Commands;

use App\User;
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
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $plain_password = $this->argument("password");

        try {
            $user = new User([
                "name" => $this->argument("name"),
                "email" => $this->argument("email"),
                'email_verified_at' => now(),
                "password" => Hash::make($plain_password),
                'is_admin' => $this->option("admin"),
            ]);
            $user->save();
            return 0;
        } catch (QueryException $ex) {
            print("Unable to create user.\n");
            return 1;
        }
    }
}

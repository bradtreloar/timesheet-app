<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;

class DeleteUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'delete:user {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete a user.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            $user = User::where('email', $this->argument("email"))->first();
            $user->delete();
            return 0;
        } catch (QueryException $ex) {
            print("Unable to delete user.\n");
            return 1;
        }
    }
}

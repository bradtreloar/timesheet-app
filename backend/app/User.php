<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'is_admin'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_admin' => 'bool',
    ];

    public function timesheets()
    {
        return $this->hasMany(Timesheet::class);
    }

    /**
     * Checks if user has given role
     * 
     * @param string $role
     *   The role to search for.
     * @return bool
     *   Whether the user has the role.
     */
    public function hasRole(string $role) {
        $user_roles = explode('|', $this->roles);
        return in_array($role, $user_roles);
    }
}

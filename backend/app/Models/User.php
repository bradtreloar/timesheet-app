<?php

namespace App\Models;

use App\Contracts\SMSNotification;
use App\Events\UserCreated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use Notifiable;
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'phone_number', 'accepts_reminders', 'is_admin', 'default_values'
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
        'accepts_reminders' => 'bool',
    ];

    public function timesheets()
    {
        return $this->hasMany(Timesheet::class);
    }

    protected static function booted()
    {
        static::creating(function ($model) {
            // Generate a random password if the user was created without one.
            if (!$model->password) {
                $model->password = Hash::make(Str::random(40));
            }
        });

        static::created(function (User $user) {
            Event::dispatch(new UserCreated($user));
        });
    }

    /**
     * Route notifications for the SMS channel.
     *
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return string
     */
    public function routeNotificationForSMS(SMSNotification $notification)
    {
        return $this->phone_number;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'date', 'reason'
    ];

    protected $appends = [
        'reasonLabel'
    ];

    protected $dates = [
        'date',
    ];

    public function getReasonLabelAttribute()
    {
        return [
            "absent:sick-day" => "Rostered but absent: sick day",
            "absent:not-sick-day" => "Rostered but absent: not a sick day",
            "annual-leave" => "Annual leave",
            "long-service" => "Long service leave",
            "unpaid-leave" => "Unpaid leave",
            "public-holiday" => "Public holiday",
            "rostered-day-off" => "Rostered day off",
        ][$this->reason];
    }

    public function timesheet(): BelongsTo
    {
        return $this->belongsTo(Timesheet::class);
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shift extends Model
{
    protected $fillable = [
        'start', 'end', 'break_duration',
    ];

    protected $appends = [
        'hours'
    ];

    protected $dates = [
        'start',
        'end',
    ];

    public function getHoursAttribute()
    {
        $shift_minutes = $this->end->diffInMinutes($this->start) - $this->break_duration;
        $shift_hours = $shift_minutes / 60;
        return number_format($shift_hours, 2);
    }

    public function timesheet(): BelongsTo
    {
        return $this->belongsTo(Timesheet::class);
    }
}

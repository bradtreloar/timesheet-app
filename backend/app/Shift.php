<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shift extends Model
{
    protected $fillable = [
        'start', 'end', 'break_duration',
    ];

    protected $appends = ['hours'];

    public function getHoursAttribute()
    {
        $shift_duration = $this->start->diff($this->end);
        $shift_minutes = $shift_duration->h * 60 + $shift_duration->m - $this->break_duration;
        $shift_hours = $shift_minutes / 60;
        return number_format($shift_hours, 2);
    }

    public function timesheet(): BelongsTo
    {
        return $this->belongsTo(Timesheet::class);
    }
}

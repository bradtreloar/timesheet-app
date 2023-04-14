<?php

namespace App\Models;

use App\Events\TimesheetCompleted;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Timesheet extends Model
{
    use HasFactory;

    const STATE_DRAFT = 'timesheet.draft';

    const STATE_COMPLETED = 'timesheet.completed';

    protected $fillable = [
        'comment',
    ];

    protected $appends = [
        'totalWeekdayHours',
        'shifts_and_absences',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'state' => self::STATE_DRAFT,
    ];

    public function getTotalWeekdayHoursAttribute()
    {
        $totalWeekdayHours = 0;
        $shifts = $this->shifts()->get();
        foreach ($shifts as $shift) {
            if ($shift->start->dayOfWeekIso <= 5) {
                $totalWeekdayHours += $shift->hours;
            }
        }
        return number_format($totalWeekdayHours, 2);
    }

    public function getShiftsAndAbsencesAttribute()
    {
        $shifts = $this->shifts->sortBy('start');
        $absences = $this->absences->sortBy('date');
        $entries = [];
        array_push($entries, ...$shifts, ...$absences);
        usort($entries, function ($a, $b) {
            return $b->date->diffInDays($a->date, false);
        });
        return $entries;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class);
    }

    public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class);
    }
}

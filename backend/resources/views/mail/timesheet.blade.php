@component('mail::layout')
@slot('header')
@component('mail::header', ['url' => config('app.url')])
{{ config('app.name') }}
@endcomponent
@endslot

# Timesheet submitted

@component('mail::table')
| | |
| :-- | :-- |
| __Employee__  | {{ $timesheet->user->name }} |
| __Submitted__ | {{ $timesheet->created_at->format("j F Y") }} |
@endcomponent

<br/>

## Shifts

@if (count($timesheet->shifts) > 0)
@component('mail::table')
| Date | Start | End | Break | Hours |
| :--  | --:   | --: | --:   | --:   |
@foreach ($timesheet->shifts->sortBy('start') as $shift)
@if ($shift->start->dayOfWeekIso <= 5)
| {{ $shift->start->format("D, j M Y") }} | {{ $shift->start->format("H:i") }} | {{ $shift->end->format("H:i") }} | {{ $shift->break_duration }} min | {{ $shift->hours }} hours |
@endif
@endforeach
| __Total Weekday Hours__ |||| {{ $timesheet->totalWeekdayHours }} hours |
@foreach ($timesheet->shifts->sortBy('start') as $shift)
@if ($shift->start->dayOfWeekIso > 5)
| {{ $shift->start->format("D, j M Y") }} | {{ $shift->start->format("H:i") }} | {{ $shift->end->format("H:i") }} | {{ $shift->break_duration }} min | {{ $shift->hours }} hours |
@endif
@endforeach
@endcomponent
@else
No shifts.
@endif

## Leave and Absences

@if (count($timesheet->absences) > 0)
@component('mail::table')
| Date | Reason
| :--  | :--
@foreach ($timesheet->absences->sortBy('date') as $absence)
| {{ $absence->date->format("D, j M Y") }} | {{ $absence->reasonLabel }} |
@endforeach
@endcomponent
@else
No leave or absences.
@endif

## Comment

{{ $timesheet->comment ? $timesheet->comment : "<none>" }}

@slot('footer')
@component('mail::footer')
© {{ date('Y') }} {{ config('app.name') }}. @lang('All rights reserved.')
@endcomponent
@endslot
@endcomponent

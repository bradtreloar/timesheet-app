@component('mail::layout')
@slot('header')
@component('mail::header', ['url' => config('app.url')])
{{ config('app.name') }}
@endcomponent
@endslot

# Timesheet submitted

| | |
| :-- | :-- |
| __Employee__  | {{ $timesheet->user->name }} |
| __Submitted__ | {{ $timesheet->created_at->format("j F Y") }} |

<br/>

## Shifts

@if (count($timesheet->shifts) > 0)
@component('mail::table')
| Date | Start | End | Break | Hours |
| :--  | --:   | --: | --:   | --:   |
@foreach ($timesheet->shifts->sortBy('start') as $shift)
| {{ $shift->start->format("D, j M Y") }} | {{ $shift->start->format("H:i") }} | {{ $shift->end->format("H:i") }} | {{ $shift->break_duration }} min | {{ $shift->hours }} hours |
@endforeach
| __Total Hours__ |||| {{ $timesheet->totalHours }} hours |
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

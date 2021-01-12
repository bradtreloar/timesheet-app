<html>

<head>
<style>
body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
table {
    border-collapse: collapse;
    width: 100%;
}
th, td {
    border-top: 1px dotted #000;
    border-bottom: 1px dotted #000;
    padding: 0.5rem;
    text-align: left;
    vertical-align: top;
}
th {
    white-space: nowrap;
}
</style>
</head>

<body>
    <div>
        <p>Allbiz Supplies</p>
        <h1>Timesheet</h1>
    </div>
    <div>
        <table>
            <tbody>
                <tr>
                    <th>
                        Employee
                    </th>
                    <td style="width: 100%;">
                        {{ $timesheet->user->name }}
                    </td>
                </tr>
                <tr>
                    <th>
                        Submitted
                    </th>
                    <td style="width: 100%;">
                        {{ $timesheet->created_at->format("j F Y") }}
                    </td>
                </tr>
            </tbody>
        </table>
        <h2>Shifts</h2>
        @if (count($timesheet->shifts) > 0)
            <table>
                <thead>
                    <tr>
                        <th style="width:100%">
                            Date
                        </th>
                        <th style="text-align:right;white-space:nowrap">
                            Start
                        </th>
                        <th style="text-align:right;white-space:nowrap">
                            End
                        </th>
                        <th style="text-align:right;white-space:nowrap">
                            Break
                        </th>
                        <th style="text-align:right;white-space:nowrap">
                            Hours
                        </th>
                    </tr>
                </thead>
                <tbody style="text-align: left;vertical-align:top;">
                    @foreach ($timesheet->shifts->sortBy('start') as $shift)
                        @if ($shift->start->dayOfWeekIso <= 5)
                            <tr>
                                <td style="width:100%">
                                    {{ $shift->start->format("D, d-m-Y") }}
                                </td>
                                <td style="text-align:right;white-space:nowrap">
                                    {{ $shift->start->format("H:i") }}
                                </td>
                                <td style="text-align:right;white-space:nowrap">
                                    {{ $shift->end->format("H:i") }}
                                </td>
                                <td style="text-align:right;white-space:nowrap">
                                    {{ $shift->break_duration }} min
                                </td>
                                <td style="text-align:right;white-space:nowrap">
                                    {{ $shift->hours }} hours
                                </td>
                            </tr>
                        @endif
                    @endforeach
                    <tr>
                        <td colspan="4" style="text-align:right;white-space:nowrap">
                            <strong>Total Weekday Hours</strong>
                        </td>
                        <td style="text-align:right;white-space:nowrap">
                            {{ $timesheet->totalWeekdayHours }} hours
                        </td>
                    </tr>
                    @foreach ($timesheet->shifts->sortBy('start') as $shift)
                        @if ($shift->start->dayOfWeekIso > 5)
                            <tr>
                                <td style="width:100%">
                                    {{ $shift->start->format("D, d-m-Y") }}
                                </td>
                                <td style="text-align:right;white-space:nowrap">
                                    {{ $shift->start->format("H:i") }}
                                </td>
                                <td style="text-align:right;white-space:nowrap">
                                    {{ $shift->end->format("H:i") }}
                                </td>
                                <td style="text-align:right;white-space:nowrap">
                                    {{ $shift->break_duration }} min
                                </td>
                                <td style="text-align:right;white-space:nowrap">
                                    {{ $shift->hours }} hours
                                </td>
                            </tr>
                        @endif
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No shifts.</p>
        @endif
        <h2>Leave or Absences</h2>
        @if (count($timesheet->absences) > 0)
        <table>
            <thead>
                <tr>
                    <td style="width:100%">
                        Date
                    </th>
                    <th style="text-align:right;white-space:nowrap">
                        Reason
                    </th>
                </tr>
            </thead>
            <tbody style="text-align: left;vertical-align:top;">
                @foreach ($timesheet->absences->sortBy('date') as $absence)
                    <tr>
                        <td style="width:100%;">
                            {{ $absence->date->format("D, d-m-Y") }}
                        </td>
                        <td style="white-space:nowrap">
                            {{ $absence->reasonLabel }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        @else
            <p>No leave or absences.</p>
        @endif
        <table>
            <tbody style="text-align: left;vertical-align:top;">
                <tr>
                    <th>
                        Comment
                    </th>
                    <td style="width: 100%;">
                        {{ $timesheet->comment ? $timesheet->comment : "none" }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>


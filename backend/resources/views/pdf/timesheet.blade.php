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
        <table>
            <thead>
                <tr>
                    <td style="width:100%">
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
                @endforeach
                <tr>
                    <td colspan="4" style="text-align:right;white-space:nowrap">
                        <strong>Total</strong>
                    </td>
                    <td style="text-align:right;white-space:nowrap">
                        {{ $timesheet->totalHours }} hours
                    </td>
                </tr>
            </tbody>
        </table>
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


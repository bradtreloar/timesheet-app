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
                    <th>
                        Date
                    </th>
                    <th>
                        Start
                    </th>
                    <th>
                        End
                    </th>
                    <th>
                        Break
                    </th>
                    <th>
                        Hours
                    </th>
                </tr>
            </thead>
            <tbody style="text-align: left;vertical-align:top;">
                @foreach ($timesheet->shifts as $shift)
                    <tr>
                        <td>
                            {{ $shift->start->format("D d-m-Y") }}
                        </td>
                        <td style="white-space:nowrap">
                            {{ $shift->start->format("h:i A") }}
                        </td>
                        <td style="white-space:nowrap">
                            {{ $shift->end->format("h:i A") }}
                        </td>
                        <td style="white-space:nowrap">
                            {{ $shift->break_duration }} min
                        </td>
                        <td style="white-space:nowrap">
                            {{ $shift->hours }} hours
                        </td>
                    </tr>
                @endforeach
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


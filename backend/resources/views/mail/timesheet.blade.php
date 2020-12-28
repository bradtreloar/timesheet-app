@extends('mail.layout')

@section('content')
<table style="width: 100%; min-width: 450px; border-collapse:collapse;">
    <tbody>
        <tr>
            <td style="font-size:1.25rem;font-weight:bold;padding:1rem 0">Timesheet Submitted</td>
        </tr>
        <tr>
            <td style="font-size:1.25rem;font-weight:bold;padding:1rem 0">
            <table style="width: 100%; border-collapse: collapse;">
                <tbody style="text-align: left;vertical-align:top;">
                    <tr>
                        <th style="padding: 0.5rem;width: 100%;border: 1px solid #cccccc; white-space: nowrap;">
                            Employee
                        </th>
                        <td style="padding: 0.5rem;width: 100%;border: 1px solid #cccccc; white-space: nowrap;">
                            {{ $timesheet->user->name }}
                        </td>
                    </tr>
                    <tr>
                        <th style="padding: 0.5rem;width: 100%;border: 1px solid #cccccc; white-space: nowrap;">
                            Date
                        </th>
                        <td style="padding: 0.5rem;width: 100%;border: 1px solid #cccccc; white-space: nowrap;">
                            {{ $timesheet->created_at->toString() }}
                        </td>
                    </tr>
                </tbody>
            </table>
            </td>
        </tr>
        <tr>
            <td>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 0.5rem;width: 100%;border: 1px solid #cccccc; white-space: nowrap;">
                                Start
                            </th>
                            <th style="padding: 0.5rem;width: 100%;border: 1px solid #cccccc; white-space: nowrap;" h>
                                End
                            </th>
                            <th style="padding: 0.5rem;width: 100%;border: 1px solid #cccccc; white-space: nowrap;" h>
                                Break Duration
                            </th>
                            <th style="padding: 0.5rem;width: 100%;border: 1px solid #cccccc; white-space: nowrap;" h>
                                Hours
                            </th>
                        </tr>
                    </thead>
                    <tbody style="text-align: left;vertical-align:top;">
                        @foreach ($timesheet->shifts as $shift)
                            <tr>
                                <td style="padding: 0.5rem;border: 1px solid #cccccc;">
                                    {{ $shift->start->toString() }}
                                </td>
                                <td style="padding: 0.5rem;border: 1px solid #cccccc;">
                                    {{ $shift->end->toString() }}
                                </td>
                                <td style="padding: 0.5rem;border: 1px solid #cccccc;">
                                    {{ $shift->break_duration }}
                                </td>
                                <td style="padding: 0.5rem;border: 1px solid #cccccc;">
                                    {{ $shift->hours }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
@endsection

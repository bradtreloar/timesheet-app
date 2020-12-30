import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { getShiftHours, Time } from "services/date";
import { Timesheet } from "types";

interface TimesheetViewProps {
  timesheet: Timesheet;
}

const TimesheetView: React.FC<TimesheetViewProps> = ({ timesheet }) => {
  const { shifts } = timesheet;

  const tableRows = useMemo(
    () =>
      shifts?.map((shift, index) => {
        const { start, end, breakDuration } = shift;
        const totalHours = getShiftHours(shift);

        const startDateTime = DateTime.fromISO(start);
        const endDateTime = DateTime.fromISO(end);
        const label = startDateTime.toLocaleString();
        const startTime = startDateTime.toLocaleString(DateTime.DATE_SHORT);
        const endTime = endDateTime.toLocaleString(DateTime.TIME_SIMPLE);
        const breakTime = Time.fromMinutes(breakDuration).toString();

        return (
          <tr key={index}>
            <td>{label}</td>
            <td>{startTime}</td>
            <td>{endTime}</td>
            <td>{breakTime}</td>
            <td>{totalHours}</td>
          </tr>
        );
      }),
    [shifts]
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Start</th>
          <th>End</th>
          <th>Break</th>
          <th>Hours</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
};

export default TimesheetView;

import React, { useMemo } from "react";
import { formattedDate, getShiftHours, Time } from "services/date";
import { Timesheet } from "types";

interface TimesheetViewProps {
  timesheet: Timesheet;
}

const TimesheetView: React.FC<TimesheetViewProps> = ({ timesheet }) => {
  const { shifts, created } = timesheet;

  const tableRows = useMemo(
    () =>
      shifts?.map((shift, index) => {
        const { start, end, breakDuration } = shift;
        const totalHours = getShiftHours(shift);

        const startDate = new Date(start);
        const endDate = new Date(end);
        const label = formattedDate(startDate);
        const startTime = Time.fromDate(startDate).toString();
        const endTime = Time.fromDate(endDate).toString();
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

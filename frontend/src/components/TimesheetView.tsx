import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { getShiftHours, Time } from "services/date";
import { Timesheet } from "types";

interface TimesheetViewProps {
  timesheet: Timesheet;
}

const TimesheetView: React.FC<TimesheetViewProps> = ({ timesheet }) => {
  const { shifts } = timesheet;

  const shiftRows = useMemo(
    () =>
      shifts?.map((shift, index) => {
        const { start, end, breakDuration } = shift;
        const totalHours = getShiftHours(shift);

        const startDateTime = DateTime.fromISO(start);
        const endDateTime = DateTime.fromISO(end);
        const label = startDateTime.toLocaleString();
        const startTime = startDateTime.toLocaleString(DateTime.TIME_SIMPLE);
        const endTime = endDateTime.toLocaleString(DateTime.TIME_SIMPLE);
        const breakTime = Time.fromMinutes(breakDuration).toString();

        return (
          <tr key={index}>
            <td className="w-100">{label}</td>
            <td className="text-right">{startTime}</td>
            <td className="text-right">{endTime}</td>
            <td className="text-right">{breakTime}</td>
            <td className="text-right">{totalHours}</td>
          </tr>
        );
      }),
    [shifts]
  );

  const totalHours = useMemo(
    () =>
      shifts?.reduce((totalHours, shift) => {
        return totalHours + getShiftHours(shift);
      }, 0),
    [shifts]
  );

  const submittedDate = DateTime.fromISO(
    timesheet.created as string
  ).toLocaleString(DateTime.DATE_MED);

  return (
    <>
      <p>Submitted on {submittedDate}</p>
      <h2>Shifts</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th className="text-right">Start</th>
            <th className="text-right">End</th>
            <th className="text-right">Break</th>
            <th className="text-right">Hours</th>
          </tr>
        </thead>
        <tbody>
          {shiftRows}
          <tr>
            <th>Total hours</th>
            <td colSpan={4} className="text-right">
              {totalHours}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default TimesheetView;

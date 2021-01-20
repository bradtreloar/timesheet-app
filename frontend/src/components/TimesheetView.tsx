import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { getShiftHours, Time } from "services/date";
import { Shift, Timesheet } from "types";
import { reasons } from "./forms/TimesheetForm";

interface TimesheetViewProps {
  timesheet: Timesheet;
}

const TimesheetView: React.FC<TimesheetViewProps> = ({ timesheet }) => {
  const { shifts, absences } = timesheet;

  const weekdayShifts = useMemo(
    () => shifts?.filter(({ start }) => DateTime.fromISO(start).weekday <= 5),
    [shifts]
  );

  const weekendShifts = useMemo(
    () => shifts?.filter(({ start }) => DateTime.fromISO(start).weekday > 5),
    [shifts]
  );

  const shiftRows = (shifts?: Shift[]) =>
    shifts?.map((shift, index) => {
      const { start, end, breakDuration } = shift;
      const startDateTime = DateTime.fromISO(start);
      const endDateTime = DateTime.fromISO(end);

      return (
        <tr key={index}>
          <td className="w-100">
            <span className="d-none d-md-inline">{startDateTime.weekdayShort},&nbsp;</span>
            {startDateTime.toLocaleString()}
          </td>
          <td className="text-right text-nowrap">{startDateTime.toLocaleString(DateTime.TIME_SIMPLE)}</td>
          <td className="text-right text-nowrap">{endDateTime.toLocaleString(DateTime.TIME_SIMPLE)}</td>
          <td className="text-right text-nowrap">{Time.fromMinutes(breakDuration).toString()}</td>
          <td className="text-right text-nowrap">{getShiftHours(shift)} hours</td>
        </tr>
      );
    });

  const weekdayShiftRows = useMemo(() => shiftRows(weekdayShifts), [
    weekdayShifts,
  ]);
  const weekendShiftRows = useMemo(() => shiftRows(weekendShifts), [
    weekendShifts,
  ]);

  const absenceRows = useMemo(
    () =>
      absences?.map((absence, index) => {
        const { date, reason } = absence;

        return (
          <tr key={index}>
            <td className="w-100">
              <span className="d-none d-md-inline">{DateTime.fromISO(date).weekdayShort},&nbsp;</span>
              {DateTime.fromISO(date).toLocaleString()}
            </td>
            <td className="text-nowrap">{reasons[reason]}</td>
          </tr>
        );
      }),
    [absences]
  );

  const totalWeekdayHours = useMemo(
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
      <div>
        <h2>Shifts</h2>
        {shifts && shifts.length > 0 ? (
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
              {weekdayShiftRows}
              <tr>
                <th colSpan={3}>Total weekday hours</th>
                <td colSpan={2} className="text-right text-nowrap">
                  {totalWeekdayHours} hours
                </td>
              </tr>
              {weekendShiftRows}
            </tbody>
          </table>
        ) : (
          <p>No shifts</p>
        )}
      </div>
      <div>
        <h2>Leave and Absences</h2>
        {absences && absences.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="text-right">Reason</th>
              </tr>
            </thead>
            <tbody>
              {absenceRows}
            </tbody>
          </table>
        ) : (
          <p>No leave or absences</p>
        )}
      </div>
    </>
  );
};

export default TimesheetView;

import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { getShiftHours, Time } from "services/date";
import { reasons } from "./forms/TimesheetForm";

const isShift = (entry: Shift | Absence) =>
  (entry as Shift).start !== undefined;

const getDate = (entry: Shift | Absence) =>
  isShift(entry)
    ? DateTime.fromISO((entry as Shift).start)
    : DateTime.fromISO((entry as Absence).date);

interface TimesheetViewProps {
  timesheet: Timesheet;
}

const TimesheetView: React.FC<TimesheetViewProps> = ({ timesheet }) => {
  const { shifts, absences } = timesheet;

  let entries = [] as (Shift | Absence)[];
  if (shifts) {
    entries = [...entries, ...shifts];
  }
  if (absences) {
    entries = [...entries, ...absences];
  }
  // Sort the entries by date order, using the shift start time for its date.
  entries = entries.sort((a, b) => {
    const dateA = getDate(a);
    const dateB = getDate(b);
    return dateA === dateB ? 0 : dateA > dateB ? 1 : -1;
  });

  const weekdayEntries = useMemo(
    () => entries.filter((entry) => getDate(entry).weekday <= 5),
    [entries]
  );

  const weekendEntries = useMemo(
    () => entries.filter((entry) => getDate(entry).weekday > 5),
    [entries]
  );

  const entryRows = (entries: (Shift | Absence)[]) =>
    entries.map((entry, index) => {
      if (isShift(entry)) {
        const { start, end, breakDuration } = entry as Shift;
        const startDateTime = DateTime.fromISO(start);
        const endDateTime = DateTime.fromISO(end);

        return (
          <tr key={index}>
            <td className="w-100">
              <span className="d-none d-md-inline">
                {startDateTime.weekdayShort},&nbsp;
              </span>
              {startDateTime.toLocaleString()}
            </td>
            <td className="text-right text-nowrap">
              {startDateTime.toLocaleString(DateTime.TIME_SIMPLE)}
            </td>
            <td className="text-right text-nowrap">
              {endDateTime.toLocaleString(DateTime.TIME_SIMPLE)}
            </td>
            <td className="text-right text-nowrap">
              {Time.fromMinutes(breakDuration).toString()}
            </td>
            <td className="text-right text-nowrap">
              {getShiftHours(entry as Shift)} hours
            </td>
          </tr>
        );
      } else {
        const { date, reason } = entry as Absence;

        return (
          <tr key={index}>
            <td className="w-100">
              <span className="d-none d-md-inline">
                {DateTime.fromISO(date).weekdayShort},&nbsp;
              </span>
              {DateTime.fromISO(date).toLocaleString()}
            </td>
            <td className="text-nowrap" colSpan={4}>{reasons[reason]}</td>
          </tr>
        );
      }
    });

  const weekdayEntryRows = useMemo(() => entryRows(weekdayEntries), [
    weekdayEntries,
  ]);
  const weekendEntryRows = useMemo(() => entryRows(weekendEntries), [
    weekendEntries,
  ]);

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
        <h2>Shifts, Leave and Absences</h2>
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
            {weekdayEntryRows}
            <tr>
              <th colSpan={3}>Total weekday hours</th>
              <td colSpan={2} className="text-right text-nowrap">
                {totalWeekdayHours} hours
              </td>
            </tr>
            {weekendEntryRows}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TimesheetView;

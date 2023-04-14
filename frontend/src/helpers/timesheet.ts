import store from "store";
import { DateTime } from "luxon";

export const getWeekStartDate = (timesheet: Timesheet) => {
  const { shifts, absences } = timesheet;
  let weekStartDate = null;
  if (shifts && shifts.length > 0) {
    const shiftDate = DateTime.fromISO(shifts[0].start);
    return shiftDate.set({ weekday: 1, hour: 0, minute: 0 });
  } else if (absences && absences.length > 0) {
    const absenceDate = DateTime.fromISO(absences[0].date);
    return absenceDate.set({ weekday: 1, hour: 0, minute: 0 });
  }

  throw new Error(`Cannot get week start date for timesheet.`);
};

export const isRepeatTimesheet = (newTimesheet: Timesheet) => {
  const { timesheets } = store.getState().timesheets;
  const newWeekStartDate = getWeekStartDate(newTimesheet);
  for (let timesheet of timesheets) {
    const weekStartDate = getWeekStartDate(timesheet);
    if (weekStartDate.toISO() === newWeekStartDate.toISO()) {
      return true;
    }
  }

  return false;
};

import { Shift, ShiftTimes } from "../types";
import { Time } from "./date";

export const getShiftDuration = (shiftTimes: ShiftTimes) => {
  const startTime = new Time(
    shiftTimes.startTime.hours,
    shiftTimes.startTime.minutes
  );
  const endTime = new Time(
    shiftTimes.endTime.hours,
    shiftTimes.endTime.minutes
  );
  const breakDuration = new Time(
    shiftTimes.breakDuration.hours,
    shiftTimes.breakDuration.minutes
  );

  if (startTime.isNull() || endTime.isNull() || breakDuration.isNull()) {
    return null;
  }

  const shiftMinutes =
    endTime.toMinutes() - startTime.toMinutes() - breakDuration.toMinutes();
  if (shiftMinutes <= 0) {
    return 0;
  }

  return Time.fromMinutes(shiftMinutes).toHours();
};

export const getShiftFromTimes = (
  date: Date,
  shiftTimes: ShiftTimes
): Shift => {
  if (shiftTimes === null) {
    throw new Error(`No shift times.`);
  }

  const { startTime, endTime, breakDuration } = shiftTimes;
  const shiftDuration = getShiftDuration(shiftTimes);

  if (shiftDuration === null || shiftDuration <= 0) {
    throw new Error(`Invalid shift times.`);
  }

  return {
    start: Time.fromObject(startTime).toDate(date).toISOString(),
    end: Time.fromObject(endTime).toDate(date).toISOString(),
    breakDuration: Time.fromObject(breakDuration).toMinutes(),
  };
};

export const getTimesFromShift = (shift: Shift): ShiftTimes => {
  const start = new Date(shift.start);
  const end = new Date(shift.end);
  const breakHours = Math.floor(shift.breakDuration / 60);
  const breakMinutes = shift.breakDuration % 60;

  return {
    isActive: true,
    startTime: {
      hours: start.getHours().toString(),
      minutes: start.getMinutes().toString(),
    },
    endTime: {
      hours: end.getHours().toString(),
      minutes: end.getMinutes().toString(),
    },
    breakDuration: {
      hours: breakHours.toString(),
      minutes: breakMinutes.toString(),
    },
  };
};

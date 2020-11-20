import { Shift, ShiftTimes } from "../types";
import { SimpleTime } from "./date";

export const getShiftDuration = (shiftTimes: ShiftTimes) => {
  const { startTime, endTime, breakDuration } = shiftTimes;

  if (startTime.isNull() || endTime.isNull() || breakDuration.isNull()) {
    return null;
  }

  const shiftMinutes =
    endTime.toMinutes() - startTime.toMinutes() - breakDuration.toMinutes();
  if (shiftMinutes <= 0) {
    return 0;
  }

  const shiftDuration = SimpleTime.fromMinutes(shiftMinutes);
  return shiftDuration.toHours();
};

export const getShiftFromTimes = (
  date: Date,
  shiftTimes: ShiftTimes
): Shift => {
  if (shiftTimes === null) {
    throw new Error(`No shift times.`);
  }

  const { startTime, endTime, breakDuration } = shiftTimes;
  if (!(startTime && endTime && breakDuration)) {
    throw new Error(`Invalid shift times.`);
  }

  const shiftDuration =
    endTime.toMinutes() - startTime.toMinutes() - breakDuration.toMinutes();

  if (shiftDuration <= 0) {
    throw new Error(`Invalid shift times.`);
  }

  return {
    start: startTime.toDate(date),
    end: endTime.toDate(date),
    breakDuration: breakDuration.toMinutes(),
  };
};

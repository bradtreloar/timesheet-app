import { Shift, ShiftTimes } from "../types";
import { SimpleTime } from "./date";

export const getShiftDuration = (shiftTimes: ShiftTimes) => {
  if (shiftTimes !== null) {
    const { startTime, endTime, breakDuration } = shiftTimes;
    if (startTime && endTime && breakDuration) {
      const shiftMinutes =
        endTime.toMinutes() - startTime.toMinutes() - breakDuration.toMinutes();
      if (shiftMinutes >= 0) {
        const shiftDuration = SimpleTime.fromMinutes(shiftMinutes);
        return shiftDuration.toHours();
      }
    }
  }

  return null;
};

export const getShiftFromTimes = (date: Date, shiftTimes: ShiftTimes): Shift => {
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

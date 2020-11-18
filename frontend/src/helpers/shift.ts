import { ShiftTimes } from "../types";
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

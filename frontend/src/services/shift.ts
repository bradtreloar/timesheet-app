import { ShiftTimes } from "types";
import { Time } from "services/date";

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

import { DateTime } from "luxon";

/**
 * A class for storing a time with only hours and minute.
 */
export class Time {
  hour: number | null;
  minute: number | null;

  /**
   * @param hour    The hour value for the time
   * @param minute  The minute value for the time
   */
  constructor(hour: number | string | null, minute: number | string | null) {
    this.hour = Time.parseValue(hour);
    this.minute = Time.parseValue(minute);
    this.validate();
  }

  static parseValue(value: string | number | null) {
    if (typeof value === "string") {
      return value === "" ? null : parseInt(value);
    }
    return value;
  }

  static validateValue(value: number | null) {
    if (value === null) {
      return true;
    }

    return value >= 0;
  }

  validate() {
    if (this.hour !== null) {
      if (isNaN(this.hour)) {
        throw new InvalidTimeException(`hour contains an invalid value`);
      }

      if (this.hour < 0 || this.hour >= 24) {
        throw new InvalidTimeException(`hour must be between 0 and 23`);
      }
    }

    if (this.minute !== null) {
      if (isNaN(this.minute)) {
        throw new InvalidTimeException(`minute contains an invalid value`);
      }

      if (this.minute < 0 || this.minute >= 60) {
        throw new InvalidTimeException(`minute must be between 0 and 59`);
      }
    }
  }

  /**
   * Creates a Time object from a Date.
   *
   * @param value  The Date input value
   *
   * @return  The Time object.
   */
  static fromDate(value: Date) {
    return new Time(value.getHours(), value.getMinutes());
  }

  /**
   * Creates a Time object from a string.
   *
   * @param value  The string input value, in format HH:MM
   *
   * @return  The Time object.
   */
  static fromString(value: string) {
    const components = value.split(":");
    if (components.length !== 2) {
      throw new InvalidTimeException(`${value} is not formatted as HH:MM`);
    }

    const hour = parseInt(components[0]);
    const minute = parseInt(components[1]);

    return new Time(hour, minute);
  }

  /**
   * Creates a Time object from a plain object.
   *
   * @param value  The object input value, with hour and minute properties.
   *
   * @return  The Time object.
   */
  static fromObject(value: { hour: string; minute: string }) {
    const hour = parseInt(value.hour);
    const minute = parseInt(value.minute);
    return new Time(hour, minute);
  }

  /**
   * Creates a Time object from an arbitrary number of minute.
   */
  static fromMinutes(totalMinutes: number) {
    const totalHours = Math.floor(totalMinutes / 60);
    return new Time(totalHours % 24, totalMinutes % 60);
  }

  /**
   * Checks if the time is null.
   */
  isNull() {
    return this.hour === null && this.minute === null;
  }

  /**
   * Returns the time as a string formatted as HH:MM.
   *
   * @return  The formatted time string.
   */
  toString() {
    const hour = this.hour ? this.hour.toString().padStart(2, "0") : "00";
    const minute = this.minute ? this.minute.toString().padStart(2, "0") : "00";
    return `${hour}:${minute}`;
  }

  /**
   * Returns the time as a array of numbers
   *
   * @return  An array containing the hour and minute values.
   */
  toArray() {
    return [this.hour, this.minute];
  }

  /**
   * Create a DateTime object with this time and the given date.
   *
   * @param date
   */
  toDateTime(date: Date) {
    return DateTime.fromObject({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: this.hour || 0,
      minute: this.minute || 0,
      second: 0,
      millisecond: 0,
    });
  }

  /**
   * Get this time in minute.
   */
  toMinutes() {
    const thisHours = this.hour || 0;
    const thisMinutes = this.minute || 0;
    return thisHours * 60 + thisMinutes;
  }

  /**
   * Get this time in hours.
   */
  toHours() {
    const thisHours = this.hour || 0;
    const thisMinutes = this.minute || 0;
    return parseFloat((thisHours + thisMinutes / 60).toFixed(2));
  }

  /**
   * Adds the given time to this time.
   */
  add(time: Time) {
    const totalMinutes = this.toMinutes() + time.toMinutes();
    return Time.fromMinutes(totalMinutes);
  }

  /**
   * Subtract the given time from this time.
   */
  subtract(time: Time) {
    let diffInMinutes = this.toMinutes() - time.toMinutes();
    return Time.fromMinutes(
      diffInMinutes >= 0 ? diffInMinutes : diffInMinutes + 24 * 60
    );
  }
}

export class InvalidTimeException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidTimeException.prototype);
  }
}

/**
 * Calculates a shift duration in hours from a set of times.
 *
 * @param shiftValues
 */
export const getShiftHoursFromTimes = (shiftValues: ShiftValues) => {
  const startTime = Time.fromObject(shiftValues.startTime);
  const endTime = Time.fromObject(shiftValues.endTime);
  const breakDuration = Time.fromObject(shiftValues.breakDuration);

  const shiftMinutes =
    endTime.toMinutes() - startTime.toMinutes() - breakDuration.toMinutes();
  if (shiftMinutes <= 0) {
    return 0;
  }

  return Time.fromMinutes(shiftMinutes).toHours();
};

/**
 * Calculates a shift duration in hours from a set of dates.
 */
export const getShiftHours = ({ start, end, breakDuration }: Shift) => {
  // Get the difference between start and end times, minus break duration.
  const shiftMinutes =
    (new Date(end).getTime() - new Date(start).getTime()) / 60000 -
    breakDuration;
  return shiftMinutes / 60;
};

/**
 * Calculates a shift duration in hours from a set of dates.
 */
export const getTimesheetTotalHours = ({ shifts }: Timesheet) => {
  return shifts
    ? shifts
        .reduce((totalHours, shift) => {
          return totalHours + getShiftHours(shift);
        }, 0)
        .toFixed(2)
    : "0.00";
};

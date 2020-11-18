import { isInteger } from "lodash";
import { FIRST_DAY_OF_WEEK } from "../settings";

/**
 * Add week to a Date.
 *
 * @param date
 */
export const addWeek = (date: Date) => {
  return addDays(date, 7);
};

/**
 * Subtract week from a Date.
 *
 * @param date
 */
export const subtractWeek = (date: Date) => {
  return addDays(date, -7);
};

/**
 * Add days to a Date.
 *
 * @param date
 * @param days
 */
export const addDays = (date: Date, days: number) => {
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * Add hours to a Date
 *
 * @param date
 * @param hours
 */
export const addHours = (date: Date, hours: number) => {
  var newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

/**
 * Add hours to a Date
 *
 * @param date
 * @param hours
 */
export const addMinutes = (date: Date, minutes: number) => {
  var newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};

/**
 * Gets the start of the week that the date belongs to.
 *
 * @param date   The date to count back from.
 * @return date  The date of the start of the week.
 */
export const startOfWeek = (date: Date) => {
  const day = date.getDay();
  const newDate = addDays(date, FIRST_DAY_OF_WEEK - day);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Gets the end of the week that the date belongs to.
 *
 * @param date   The date to count forward from.
 * @return date  The date of the end of the week.
 */
export const endOfWeek = (date: Date) => {
  const day = date.getDay();
  const newDate = addDays(date, FIRST_DAY_OF_WEEK - day + 7);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Gets the Australian English day name.
 *
 * @param date
 */
function getDayName(date: Date) {
  return date.toLocaleDateString("en-AU", { weekday: "long" });
}

/**
 * Gets the Australian English month name.
 *
 * @param date
 */
function getMonthName(date: Date) {
  return date.toLocaleDateString("en-AU", { month: "long" });
}

/**
 * Converts date to string in format DD-MM-YYYY
 *
 * @param date  The date to format
 *
 * @return string  The formatted date.
 */
export const formattedDate = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
};

/**
 * Converts date to string in format DD-MM-YYYY
 *
 * @param date  The date to format
 *
 * @return string  The formatted date.
 */
export const longFormatDate = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, "0");
  const monthName = getMonthName(date);
  const day = date.getDate().toString().padStart(2, "0");
  const dayName = getDayName(date);

  return `${dayName} ${day} ${monthName} ${year}`;
};

/**
 * A class for storing a time with only hours and minutes.
 */
export class SimpleTime {
  hours: number | null;
  minutes: number | null;

  /**
   * @param hours    The hours value for the time
   * @param minutes  The minutes value for the time
   */
  constructor(hours: number | null, minutes: number | null) {
    const hoursIsValid =
      hours == null || (isInteger(hours) && hours >= 0 && hours < 24);
    const minutesIsValid =
      minutes == null || (isInteger(minutes) && minutes >= 0 && minutes < 60);

    if (!hoursIsValid) {
      throw new InvalidTimeException(`${hours} is not a valid value for hours`);
    }

    if (!minutesIsValid) {
      throw new InvalidTimeException(
        `${minutes} is not a valid value for minutes`
      );
    }

    this.hours = hours;
    this.minutes = minutes;
  }

  /**
   * Creates a SimpleTime object from a string..
   *
   * @param value  The string input value, in format HH:MM
   *
   * @return  The SimpleTime object.
   */
  static fromString(value: string) {
    const throwException = () => {
      throw new InvalidTimeException(`${value} is not formatted as HH:MM`);
    };

    const components = value.split(":");
    if (components.length !== 2) {
      throwException();
    }

    const hours = parseInt(components[0]);
    const minutes = parseInt(components[1]);

    return new SimpleTime(hours, minutes);
  }

  /**
   * Creates a SimpleTime object from an arbitrary number of minutes.
   */
  static fromMinutes(totalMinutes: number) {
    const totalHours = Math.floor(totalMinutes / 60);
    return new SimpleTime(totalHours % 24, totalMinutes % 60);
  }

  /**
   * Returns the time as a string formatted as HH:MM.
   *
   * @return  The formatted time string.
   */
  toString() {
    const hours = this.hours ? this.hours.toString().padStart(2, "0") : "00";
    const minutes = this.minutes
      ? this.minutes.toString().padStart(2, "0")
      : "00";
    return `${hours}:${minutes}`;
  }

  /**
   * Returns the time as a array of numbers
   *
   * @return  An array containing the hours and minutes values.
   */
  toArray() {
    return [this.hours, this.minutes];
  }

  /**
   * Create a date with this time and the given date.
   *
   * @param date
   */
  toDate(date: Date) {
    const hours = this.hours || 0;
    const minutes = this.minutes || 0;
    return addMinutes(addHours(date, hours), minutes);
  }

  /**
   * Get this time in minutes.
   */
  toMinutes() {
    const thisHours = this.hours || 0;
    const thisMinutes = this.minutes || 0;
    return thisHours * 60 + thisMinutes;
  }

  /**
   * Get this time in hours.
   */
  toHours() {
    const thisHours = this.hours || 0;
    const thisMinutes = this.minutes || 0;
    return thisHours + thisMinutes / 60;
  }

  /**
   * Adds the given time to this time.
   */
  add(time: SimpleTime) {
    const totalMinutes = this.toMinutes() + time.toMinutes();
    return SimpleTime.fromMinutes(totalMinutes);
  }

  /**
   * Subtract the given time from this time.
   */
  subtract(time: SimpleTime) {
    let diffInMinutes = this.toMinutes() - time.toMinutes();
    return SimpleTime.fromMinutes(
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

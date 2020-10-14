import { isInteger } from "lodash";

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
  newDate.setHours(newDate.getHours() + minutes);
  return newDate;
};


/**
 * Converts date to string in format YYYY-MM-DD
 * 
 * @param date  The date to format
 * 
 * @return string  The formatted date.
 */
export const formatDate = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * A class for storing a time with only hours and minutes.
 */
export class SimpleTime {
  hours: number;
  minutes: number;

  /**
   * @param hours    The hours value for the time
   * @param minutes  The minutes value for the time
   */
  constructor(hours: number, minutes: number) {
    const hoursIsValid = isInteger(hours) && hours >= 0 && hours < 24;
    const minutesIsValid = isInteger(minutes) && minutes >= 0 && minutes < 60;

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
   * Returns the time as a string formatted as HH:MM.
   *
   * @return  The formatted time string.
   */
  toString() {
    const hours = this.hours.toString().padStart(2, "0");
    const minutes = this.hours.toString().padStart(2, "0");
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
}

export class InvalidTimeException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidTimeException.prototype);
  }
}

import { Shift, ShiftTimes, Timesheet, User } from "../types";
import randomstring from "randomstring";
import { addDays, addHours, SimpleTime } from "../helpers/date";

const randomID = () => randomstring.generate();

const range = (length: number) => [...Array.from(new Array(length).keys())];

export const randomUser = (userIsAdmin?: boolean): User => {
  return {
    id: randomID(),
    name: randomstring.generate({
      length: 12,
      charset: "alphabetic",
    }),
    email: `${randomstring.generate({
      length: 12,
      charset: "alphabetic",
      capitalization: "lowercase",
    })}@example.com`,
    isAdmin: userIsAdmin === true,
  };
};

export const randomPassword = () => randomstring.generate();

export const randomInt = (min: number, max: number) => {
  const range = max - min;
  return Math.floor(Math.random() * range) + min;
};

export const randomMinutes = (min: number, max: number) => {
  return randomInt(min, max);
};

export const randomSimpleTime = (min: string, max: string) => {
  const [minHours, minMinutes] = SimpleTime.fromString(min).toArray();
  const [maxHours, maxMinutes] = SimpleTime.fromString(max).toArray();
  const hours = randomInt(minHours as number, maxHours as number);
  const minutes = randomInt(minMinutes as number, maxMinutes as number);
  return new SimpleTime(hours, minutes);
};

export const randomShiftTimesArray = (): ShiftTimes[] => range(7).map(() => 
  randomShiftTimes()
);

/**
 * Generates random ShiftTimes
 *
 * @param date
 */
export const randomShiftTimes = (): ShiftTimes => {
  const shiftDuration = Math.floor(Math.random() * 9) + 3;
  const breakMinutes = Math.floor(Math.random() * 15) + 30;
  const startHours = Math.floor(Math.random() * 12);
  const endHours = startHours + shiftDuration;
  const startMinutes = Math.floor(Math.random() * 60);
  const endMinutes = Math.floor(Math.random() * 60);;
  return {
    startTime: new SimpleTime(startHours, startMinutes),
    endTime: new SimpleTime(endHours, endMinutes),
    breakDuration: new SimpleTime(0, breakMinutes),
  };
};

/**
 * Generates random dates that are up to 12 hours apart and are within 24 hours
 * of the given date.
 *
 * @param date
 */
export const randomShiftDates = (date: Date) => {
  const shiftDuration = Math.floor(Math.random() * 12);
  const startHours = Math.floor(Math.random() * 12);
  const start = addHours(date, startHours);
  const end = addHours(date, startHours + shiftDuration);
  return [start, end];
};

export const randomShift = (weekStartDate: Date, dateOffset: number): Shift => {
  const [start, end] = randomShiftDates(addDays(weekStartDate, dateOffset));
  return {
    start,
    end,
    breakDuration: randomMinutes(30, 60),
  };
};

export const randomTimesheet = (user: User): Timesheet => {
  const weekStartDate = new Date(Date.now());
  return {
    id: randomID(),
    userID: user.id,
    shifts: range(5).map(
      (dateOffset): Shift => randomShift(weekStartDate, dateOffset)
    ),
    created: new Date().toISOString(),
    changed: new Date().toISOString(),
  };
};

export const randomTimesheets = (user: User, count: number) =>
  range(count).map((index) => randomTimesheet(user));

import { Setting, Settings, Shift, ShiftTimes, Timesheet, User } from "../types";
import randomstring from "randomstring";
import { addDays, addHours, Time } from "../helpers/date";
import faker from "faker";
import { random as randomNumber } from "lodash";

const randomID = () => randomstring.generate();

const range = (length: number) => [...Array.from(new Array(length).keys())];

export const randomUser = (userIsAdmin?: boolean): User => {
  return {
    id: randomID(),
    name: randomstring.generate({
      length: 12,
      charset: "alphabetic",
    }),
    email: faker.internet.email(),
    isAdmin: userIsAdmin === true,
  };
};

export const randomPassword = () => randomstring.generate();

export const randomBoolean = () => Math.random() > 0.5;

export const randomInt = (min: number, max: number) => randomNumber(min, max);

export const randomMinutes = (min: number, max: number) => {
  return randomInt(min, max);
};

export const randomTime = (min: string, max: string) => {
  const [minHours, minMinutes] = Time.fromString(min).toArray();
  const [maxHours, maxMinutes] = Time.fromString(max).toArray();
  const hours = randomInt(minHours as number, maxHours as number);
  const minutes = randomInt(minMinutes as number, maxMinutes as number);
  return new Time(hours, minutes);
};

export const randomShiftTimesArray = (): ShiftTimes[] =>
  range(7).map(() => randomShiftTimes());

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
  const endMinutes = Math.floor(Math.random() * 60);
  return {
    isActive: true,
    startTime: {
      hours: startHours.toString(),
      minutes: startMinutes.toString(),
    },
    endTime: {
      hours: endHours.toString(),
      minutes: endMinutes.toString(),
    },
    breakDuration: {
      hours: "0",
      minutes: breakMinutes.toString(),
    },
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
    start: start.toISOString(),
    end: end.toISOString(),
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

export const randomSettings = (): Setting[] => [
  {
    id: randomID(),
    name: "timesheetRecipients",
    value: faker.internet.email(),
    created: new Date().toISOString(),
    changed: new Date().toISOString(),
  },
  {
    id: randomID(),
    name: "startOfWeek",
    value: randomInt(0, 6).toString(),
    created: new Date().toISOString(),
    changed: new Date().toISOString(),
  },
];

export const randomSettingsObject = (): Settings => ({
  timesheetRecipients: faker.internet.email(),
  startOfWeek: randomInt(0, 6),
});

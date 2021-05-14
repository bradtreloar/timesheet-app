import randomstring from "randomstring";
import { Time } from "services/date";
import faker from "faker";
import { random as randomNumber, range } from "lodash";
import { DateTime } from "luxon";
import { reasons } from "components/forms/TimesheetForm";

const randomID = () => randomstring.generate();

export const randomUser = (userIsAdmin?: boolean): User => {
  return {
    id: randomID(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber("04## ### ###"),
    acceptsReminders: true,
    isAdmin: userIsAdmin === true,
    defaultShiftValues: range(7).map((index) => randomShiftValues()),
  };
};

export const randomUsers = (count: number) =>
  range(count).map(() => randomUser());

export const randomPassword = () => randomstring.generate();

export const randomBoolean = () => Math.random() > 0.5;

export const randomInt = (min: number, max: number) => randomNumber(min, max);

export const randomMinutes = (min: number, max: number) => {
  return randomInt(min, max);
};

export const randomTime = (min: string, max: string) => {
  const [minHours, minMinutes] = Time.fromString(min).toArray();
  const [maxHours, maxMinutes] = Time.fromString(max).toArray();
  const hour = randomInt(minHours as number, maxHours as number);
  const minute = randomInt(minMinutes as number, maxMinutes as number);
  return new Time(hour, minute);
};

export const randomShiftValuesArray = (): ShiftValues[] =>
  range(7).map(() => randomShiftValues());

export const randomReason = () => {
  const reasonKeys = Object.keys(reasons);
  return reasonKeys[
    randomInt(0, reasonKeys.length - 1)
  ] as keyof typeof reasons;
};

/**
 * Generates random ShiftValues
 *
 * @param date
 */
export const randomShiftValues = (): ShiftValues => {
  const shiftDuration = Math.floor(Math.random() * 9) + 3;
  const breakMinutes = Math.floor(Math.random() * 15) + 30;
  const startHours = Math.floor(Math.random() * 12);
  const endHours = startHours + shiftDuration;
  const startMinutes = Math.floor(Math.random() * 60);
  const endMinutes = Math.floor(Math.random() * 60);
  return {
    isActive: true,
    reason: "none",
    startTime: {
      hour: startHours.toString(),
      minute: startMinutes.toString(),
    },
    endTime: {
      hour: endHours.toString(),
      minute: endMinutes.toString(),
    },
    breakDuration: {
      hour: "0",
      minute: breakMinutes.toString(),
    },
  };
};

/**
 * Generates random dates that are up to 12 hours apart and are within 24 hours
 * of the given date.
 *
 * @param date
 */
export const randomShiftDates = (datetime: DateTime) => {
  const shiftDuration = Math.floor(Math.random() * 9) + 3;
  const startHour = Math.floor(Math.random() * 12);
  const start = datetime.plus({ hours: startHour });
  const end = start.plus({ hours: shiftDuration });
  return [start, end];
};

export const randomShift = (dateTime: DateTime): Shift => {
  const [start, end] = randomShiftDates(dateTime);
  return {
    start: start.toISO(),
    end: end.toISO(),
    breakDuration: randomMinutes(30, 60),
  };
};

export const randomTimesheet = (user: User): Timesheet => {
  const todayIsWeekStart = DateTime.now().weekday === 1;
  const weekStartDateTime = todayIsWeekStart
    ? DateTime.fromObject({
        weekday: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }).minus({ weeks: 1 })
    : DateTime.fromObject({
        weekday: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

  return {
    id: randomID(),
    userID: user.id as string,
    shifts: range(7).map(
      (dateOffset): Shift =>
        randomShift(weekStartDateTime.plus({ days: dateOffset }))
    ),
    created: DateTime.local().toISO(),
    changed: DateTime.local().toISO(),
    comment: randomstring.generate(60),
  };
};

export const randomTimesheets = (user: User, count: number) =>
  range(count).map(() => randomTimesheet(user));

export const randomSettings = (
  settings?: {
    [P in keyof Settings]?: string;
  }
): Setting[] => [
  {
    id: randomID(),
    name: "timesheetRecipients",
    value: settings?.timesheetRecipients || faker.internet.email(),
    created: DateTime.local().toISO(),
    changed: DateTime.local().toISO(),
  },
];

export const randomSettingsObject = (): Settings => ({
  timesheetRecipients: faker.internet.email(),
});

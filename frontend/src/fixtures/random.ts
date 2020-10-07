import { Store } from "redux";
import { Shift, Timesheet, User } from "../types";
import randomstring from "randomstring";
import { addDays, SimpleTime } from "../helpers/date";

const formattedDate = (date: Date) =>
  `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;

const randomID = () => randomstring.generate();

const range = (length: number) => [...Array.from(new Array(length).keys())];

export const randomUser = (userIsAdmin?: boolean): User => {
  const isAdmin = userIsAdmin !== undefined && userIsAdmin;
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

export const randomSimpleTime = (min: string, max: string) => {
  const randomInt = (min: number, max: number) => {
    const range = max - min;
    return Math.floor(Math.random() * range);
  };

  const [minHours, minMinutes] = SimpleTime.fromString(min).toArray();
  const [maxHours, maxMinutes] = SimpleTime.fromString(max).toArray();
  const hours = randomInt(minHours, maxHours);
  const minutes = randomInt(minMinutes, maxMinutes);
  return new SimpleTime(hours, minutes);
};

export const randomTimesheet = (user: User): Timesheet => {
  const startDate = new Date(Date.now());
  const shifts = range(5).map((index): Shift => {
    const date = addDays(startDate, index);
    return {
      date: date,
      startAt: randomSimpleTime("00:00", "10:00"),
      endAt: randomSimpleTime("14:00", "22:00"),
      breakDuration: randomSimpleTime("00:00", "01:00"),
      status: "worked",
    };
  });
  return {
    userID: user.id,
    shifts,
  };
};

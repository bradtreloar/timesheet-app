import { SimpleTime } from "./helpers/date";

export type User = {
  isAdmin: boolean;
  id: string;
  name: string;
  email: string;
};

export type Timesheet = {
  userID: string;
  shifts: Shift[];
};

export type Shift = {
  date: Date;
  startAt: SimpleTime;
  endAt: SimpleTime;
  breakDuration: SimpleTime;
  status: "worked" | "not_rostered" | "sick" | "public_holiday";
};

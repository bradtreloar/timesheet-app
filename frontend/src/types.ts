import { SimpleTime } from "./helpers/date";

export type User = {
  isAdmin: boolean;
  id: string;
  name: string;
  email: string;
};

export type Timesheet = {
  id?: string;
  userID: string;
  shifts?: Shift[];
  created?: string;
  changed?: string;
};

export type Shift = {
  id?: string;
  start: string;
  end: string;
  breakDuration: number;
};

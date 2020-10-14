import { SimpleTime } from "./helpers/date";

export type User = {
  isAdmin: boolean;
  id: string;
  name: string;
  email: string;
};

export type Timesheet = {
  id?: string;
  created?: string;
  changed?: string;
  userID: string;
  shifts?: Shift[];
};

export type Shift = {
  id?: string;
  created?: string;
  changed?: string;
  start: string;
  end: string;
  breakDuration: number;
};

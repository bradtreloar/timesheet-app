
export type User = {
  isAdmin: boolean;
  id: string;
  name: string;
  email: string;
};

export type Timesheet = {
  shifts: Shift[];
};

export type Shift = {
  date: string;
  startAt: string;
  endAt: string;
  breakDuration: string;
  status: "worked" | "not_rostered" | "sick" | "public_holiday";
};

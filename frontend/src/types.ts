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

export type ShiftTimes = {
  isActive: boolean;
  startTime: {
    hours: string;
    minutes: string;
  };
  endTime: {
    hours: string;
    minutes: string;
  };
  breakDuration: {
    hours: string;
    minutes: string;
  };
};

export type Setting = {
  id: string;
  created: string;
  changed: string;
  name: string;
  value: string;
};

export type Settings = {
  timesheetRecipients: string;
  startOfWeek: string;
};

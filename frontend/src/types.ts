export type User = {
  id?: string;
  name: string;
  email: string;
  isAdmin: boolean;
  defaultShifts: ShiftTimes[] | null;
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

interface RelatedResourceData<T> {
  id: string;
  type: T;
}

interface RelatedResource<T> {
  data: RelatedResourceData<T>;
}

interface RelatedResourceArray<T> {
  data: RelatedResourceData<T>[];
}

export interface UserResource {
  id?: string;
  type: "users";
  attributes: {
    name: string;
    email: string;
    created?: string;
    changed?: string;
    default_shifts: string;
  };
  relationships: {
    timesheets?: RelatedResourceArray<"users">;
  };
}

export interface TimesheetResource {
  id?: string;
  type: "timesheets";
  attributes: {
    created?: string;
    changed?: string;
  };
  relationships: {
    user: RelatedResource<"users">;
    shifts?: RelatedResourceArray<"shifts">;
  };
}

export interface ShiftResource {
  id?: string;
  type: "shifts";
  attributes: {
    created?: string;
    changed?: string;
    start: string;
    end: string;
    break_duration: number;
  };
  relationships: {
    timesheet: RelatedResource<"timesheets">;
  };
}

export type SettingResource = {
  id: string;
  type: "settings";
  attributes: {
    created: string;
    changed: string;
    name: string;
    value: string;
  };
};

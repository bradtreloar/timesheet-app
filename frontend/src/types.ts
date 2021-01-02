import { DateTime } from "luxon";

export type User = {
  id?: string;
  name: string;
  email: string;
  isAdmin: boolean;
  defaultShifts: ShiftTimes[];
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
    hour: string;
    minute: string;
  };
  endTime: {
    hour: string;
    minute: string;
  };
  breakDuration: {
    hour: string;
    minute: string;
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
  firstDayOfWeek: string;
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

export interface UserData {
  id?: string;
  name: string;
  email: string;
  is_admin: boolean;
  default_shifts: string;
}

export interface UserResource {
  id?: string;
  type: "users";
  attributes: {
    name: string;
    email: string;
    is_admin: boolean;
    default_shifts: string;
    created?: string;
    changed?: string;
  };
  relationships: {
    timesheets?: RelatedResourceArray<"timesheets">;
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

export type MessageType = "success" | "warning" | "danger";

export type Message = {
  id: string;
  value: string;
  type: MessageType;
  created: DateTime;
};

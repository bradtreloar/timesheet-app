import { reasons } from "components/forms/TimesheetForm";
import { DateTime } from "luxon";

export type User = {
  id?: string;
  name: string;
  email: string;
  isAdmin: boolean;
  defaultShiftValues: ShiftValues[];
};

export type Timesheet = {
  id?: string;
  created?: string;
  changed?: string;
  userID: string;
  shifts?: Shift[];
  absences?: Absence[];
  comment: string;
};

export type Shift = {
  id?: string;
  created?: string;
  changed?: string;
  start: string;
  end: string;
  breakDuration: number;
};

export type Absence = {
  id?: string;
  created?: string;
  changed?: string;
  date: string;
  reason: Reason;
}

export type Reason = keyof typeof reasons;

export type ShiftValues = {
  isActive: boolean;
  reason: Reason;
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
  id?: string | number;
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
    comment: string;
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

export interface AbsenceResource {
  id?: string;
  type: "absences";
  attributes: {
    created?: string;
    changed?: string;
    date: string;
    reason: Reason;
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
  value: string | JSX.Element;
  type: MessageType;
  tags: string[];
  created: DateTime;
};

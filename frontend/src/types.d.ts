import { reasons } from "components/forms/TimesheetForm";
import { DateTime } from "luxon";

export {};

declare global {
  type User = {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    acceptsReminders: boolean;
    isAdmin: boolean;
    defaultShiftValues: ShiftValues[];
  };

  type Timesheet = {
    id?: string;
    created?: string;
    changed?: string;
    userID: string;
    shifts?: Shift[];
    absences?: Absence[];
    comment: string;
  };

  type Shift = {
    id?: string;
    created?: string;
    changed?: string;
    start: string;
    end: string;
    breakDuration: number;
  };

  type Absence = {
    id?: string;
    created?: string;
    changed?: string;
    date: string;
    reason: Reason;
  }

  type Reason = keyof typeof reasons;

  type ShiftValues = {
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

  type Setting = {
    id: string;
    created: string;
    changed: string;
    name: string;
    value: string;
  };

  type Settings = {
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

  interface UserData {
    id?: string | number;
    name: string;
    email: string;
    phone_number: string;
    accepts_reminders: boolean;
    is_admin: boolean;
    default_values: string;
  }

  interface UserResource {
    id?: string;
    type: "users";
    attributes: {
      name: string;
      email: string;
      phone_number: string;
      accepts_reminders: boolean;
      is_admin: boolean;
      default_values: string;
      created?: string;
      changed?: string;
    };
    relationships: {
      timesheets?: RelatedResourceArray<"timesheets">;
    };
  }

  interface TimesheetResource {
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
      absences?: RelatedResourceArray<"absences">;
    };
  }

  interface ShiftResource {
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

  interface AbsenceResource {
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

  type SettingResource = {
    id: string;
    type: "settings";
    attributes: {
      created: string;
      changed: string;
      name: string;
      value: string;
    };
  };

  type MessageType = "success" | "warning" | "danger";

  type Message = {
    id: string;
    value: string | JSX.Element;
    type: MessageType;
    tags: string[];
    created: DateTime;
  };
}
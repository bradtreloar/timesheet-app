import { getShiftDuration } from "services/shift";
import {
  SettingResource,
  ShiftResource,
  ShiftTimes,
  TimesheetResource,
  User,
  UserData,
} from "types";
import { Setting, Shift, Timesheet } from "types";
import { Time } from "./date";

export const parseSetting = (resource: SettingResource): Setting => {
  const {
    id,
    attributes: { created, changed, name, value },
  } = resource;
  return {
    id,
    changed,
    created,
    name,
    value,
  };
};

export const parseShift = (resource: ShiftResource): Shift => {
  const {
    id,
    attributes: { created, changed, start, end, break_duration: breakDuration },
  } = resource;
  return {
    id: id as string,
    created: created as string,
    changed: changed as string,
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
    breakDuration,
  };
};

export const parseTimesheet = (
  userID: string,
  resource: TimesheetResource
): Timesheet => {
  const {
    id,
    attributes: { created, changed },
  } = resource;
  return {
    id: id,
    userID,
    created: created as string,
    changed: changed as string,
    shifts: [],
  };
};

export const parseUser = (data: UserData): User => {
  const { id, name, email, is_admin, default_shifts } = data;
  return {
    id,
    name,
    email,
    isAdmin: is_admin,
    defaultShifts: JSON.parse(default_shifts),
  };
};

export const makeSettingResource = (setting: Setting): SettingResource => {
  const { id, changed, created, name, value } = setting;
  const resource: SettingResource = {
    id,
    type: "settings",
    attributes: {
      changed,
      created,
      name,
      value,
    },
  };
  return resource;
};

export const makeShiftResource = (
  shift: Shift,
  timesheet: Timesheet
): ShiftResource => {
  if (timesheet.id === undefined) {
    throw new Error(
      `Unable to create Shift resource: timesheet must have a valid ID.`
    );
  }
  const { id, start, end, breakDuration, changed, created } = shift;
  const resource: ShiftResource = {
    type: "shifts",
    attributes: {
      start,
      end,
      break_duration: breakDuration,
    },
    relationships: {
      timesheet: {
        data: {
          id: timesheet.id,
          type: "timesheets",
        },
      },
    },
  };
  if (id) {
    resource.id = id;
  }
  if (changed) {
    resource.attributes.changed = changed;
  }
  if (created) {
    resource.attributes.created = created;
  }
  return resource;
};

export const makeTimesheetResource = (
  timesheet: Timesheet
): TimesheetResource => {
  const { id, userID, changed, created } = timesheet;
  const resource: TimesheetResource = {
    type: "timesheets",
    attributes: {},
    relationships: {
      user: {
        data: {
          id: userID,
          type: "users",
        },
      },
    },
  };
  if (id) {
    resource.id = id;
  }
  if (changed && created) {
    resource.attributes = {
      changed,
      created,
    };
  }
  return resource;
};

export const makeUserData = (user: User): UserData => {
  const { id, name, email, isAdmin, defaultShifts } = user;
  return {
    id,
    name,
    email,
    is_admin: isAdmin,
    default_shifts: JSON.stringify(defaultShifts),
  };
};

export const getShiftFromTimes = (
  date: Date,
  shiftTimes: ShiftTimes
): Shift => {
  if (shiftTimes === null) {
    throw new Error(`No shift times.`);
  }

  const { startTime, endTime, breakDuration } = shiftTimes;
  const shiftDuration = getShiftDuration(shiftTimes);

  if (shiftDuration === null || shiftDuration <= 0) {
    throw new Error(`Invalid shift times.`);
  }

  return {
    start: Time.fromObject(startTime).toDate(date).toISOString(),
    end: Time.fromObject(endTime).toDate(date).toISOString(),
    breakDuration: Time.fromObject(breakDuration).toMinutes(),
  };
};

export const getTimesFromShift = (shift: Shift): ShiftTimes => {
  const start = new Date(shift.start);
  const end = new Date(shift.end);
  const breakHours = Math.floor(shift.breakDuration / 60);
  const breakMinutes = shift.breakDuration % 60;

  return {
    isActive: true,
    startTime: {
      hours: start.getHours().toString(),
      minutes: start.getMinutes().toString(),
    },
    endTime: {
      hours: end.getHours().toString(),
      minutes: end.getMinutes().toString(),
    },
    breakDuration: {
      hours: breakHours.toString(),
      minutes: breakMinutes.toString(),
    },
  };
};

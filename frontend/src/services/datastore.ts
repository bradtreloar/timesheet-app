import axios, { AxiosResponse } from "axios";
import { Shift, Timesheet, User } from "../types";
import { ShiftResource, TimesheetResource } from "./resourceTypes";
import { HOST } from "../settings";
import {
  parseTimesheet,
  makeTimesheetResource,
  parseShift,
  makeShiftResource,
} from "../helpers/jsonAPI";

export const client = axios.create({
  baseURL: `${HOST}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const jsonAPIClient = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
});

export const login = async (email: string, password: string): Promise<User> => {
  await client.get("/api/csrf-cookie");
  const response: AxiosResponse<User> = await client.post("/api/login", {
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  await client.post("/api/logout");
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await client.get(`/api/user`);
    if (response.status === 204) {
      // No current user.
      return null;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTimesheets = async (user: User): Promise<Timesheet[]> => {
  const response: AxiosResponse<{
    data: TimesheetResource[];
    included?: ShiftResource[];
  }> = await jsonAPIClient.get(`users/${user.id}/timesheets`, {
    params: {
      include: "shifts",
    },
  });
  const { data, included } = response.data;
  const timesheets = data.map((resource: TimesheetResource) => {
    return parseTimesheet(user.id, resource);
  });
  if (included !== undefined) {
    const allShifts = included.map((resource) => parseShift(resource));
    timesheets.forEach((timesheet) => {
      const shifts = allShifts.filter(({ id }) => id === timesheet.id);
      timesheet.shifts = shifts;
    });
  } 
  return timesheets;
};

export const createShifts = async (
  shifts: Shift[],
  timesheet: Timesheet
): Promise<Shift[]> => {
  const shiftResources: ShiftResource[] = shifts.map((shift) =>
    makeShiftResource(shift, timesheet)
  );
  const response: AxiosResponse<{
    data: ShiftResource[];
  }> = await jsonAPIClient.post(`/shifts`, {
    data: shiftResources,
  });
  const { data } = response.data;
  return data.map((shiftResource) => parseShift(shiftResource));
};

export const createTimesheet = async (
  timesheet: Timesheet
): Promise<Timesheet> => {
  const timesheetResource: TimesheetResource = makeTimesheetResource(timesheet);
  const response: AxiosResponse<{
    data: TimesheetResource;
  }> = await jsonAPIClient.post(`/timesheets`, {
    data: timesheetResource,
  });
  const { data } = response.data;
  return parseTimesheet(timesheet.userID, data);
};

export const deleteTimesheet = async (
  timesheet: Timesheet
): Promise<Timesheet> => {
  await jsonAPIClient.delete(`/timesheets`);
  return timesheet;
};

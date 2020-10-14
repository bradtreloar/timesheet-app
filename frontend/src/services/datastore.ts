import axios, { AxiosResponse } from "axios";
import { Timesheet, User } from "../types";
import { TimesheetResource } from "./resourceTypes";
import { HOST } from "../settings";
import { parseTimesheet, makeTimesheetResource } from "../helpers/jsonAPI";

export const client = axios.create({
  baseURL: `${HOST}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const jsonAPIClient = axios.create({
  baseURL: `${HOST}/api/v1`,
  withCredentials: true,
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
});

export class NoCurrentUserException extends Error {
  constructor() {
    super("No user is logged in.");
    Object.setPrototypeOf(this, NoCurrentUserException.prototype);
  }
}

export const login = async (email: string, password: string): Promise<User> => {
  await client.get("/sanctum/csrf-cookie");
  const response: AxiosResponse<User> = await client.post("/api/v1/login", {
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  try {
    await client.get("/api/v1/logout");
  } catch (error) {
    if (error.response?.status === "403") {
      throw new NoCurrentUserException();
    }
    throw error;
  }
};

export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await client.get(`/api/v1/user`);
    return response.data;
  } catch (error) {
    if (error.response?.status === "403") {
      throw new NoCurrentUserException();
    }
    throw error;
  }
};



export const fetchTimesheet = async (id: string): Promise<Timesheet> => {
  const response: AxiosResponse<{
    data: TimesheetResource;
  }> = await jsonAPIClient.get(`/timesheets/${id}`);
  const { data: resource } = response.data;
  return parseTimesheet(resource);
};

export const fetchTimesheets = async (): Promise<Timesheet[]> => {
  const response: AxiosResponse<{
    data: TimesheetResource[];
  }> = await jsonAPIClient.get(`/timesheets`);
  const { data: resources } = response.data;
  return resources.map((resource: TimesheetResource) => {
    return parseTimesheet(resource);
  });
};

export const createTimesheet = async (
  timesheet: Timesheet
): Promise<Timesheet> => {
  const timesheetResource: TimesheetResource = makeTimesheetResource(
    timesheet
  );
  const response: AxiosResponse<{
    data: TimesheetResource;
  }> = await jsonAPIClient.post(`/timesheets`, {
    data: timesheetResource,
  });
  const {
    data: { id },
  } = response.data;
  return Object.assign({}, timesheet, { id });
};

export const deleteTimesheet = async (
  timesheet: Timesheet
): Promise<Timesheet> => {
  const response: AxiosResponse<{
    data: TimesheetResource;
  }> = await jsonAPIClient.delete(`/timesheets`);
  return timesheet;
};

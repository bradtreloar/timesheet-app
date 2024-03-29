import axios, { AxiosResponse } from "axios";
import {
  parseTimesheet,
  makeTimesheetResource,
  parseShift,
  makeShiftResource,
  parseSetting,
  makeSettingResource,
  parseUser,
  parseUserFromResource,
  makeUserResource,
  makeAbsenceResource,
  parseAbsence,
} from "./adaptors";
import { orderBy } from "lodash";

export const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_HOST}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const jsonAPIClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_HOST}`,
  withCredentials: true,
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
});

export const login = async (email: string, password: string): Promise<User> => {
  await client.get("/csrf-cookie");
  const response: AxiosResponse<UserData> = await client.post("/login", {
    email,
    password,
  });
  return parseUser(response.data);
};

export const logout = async () => {
  await client.get("/csrf-cookie");
  await client.post("/logout");
};

export const forgotPassword = async (email: string) => {
  await client.get("/csrf-cookie");
  await client.post("/forgot-password", {
    email,
  });
};

export const setPassword = async (password: string) => {
  await client.get("/csrf-cookie");
  await client.post("/set-password", {
    password,
  });
};

export const resetPassword = async (
  email: string,
  token: string,
  password: string
) => {
  await client.get("/csrf-cookie");
  await client.post("/reset-password", {
    email,
    token,
    password,
  });
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  const response: AxiosResponse<UserData> = await client.get(`/user`);
  if (response.status === 204) {
    // No current user.
    return null;
  }
  return parseUser(response.data);
};

export const fetchUsers = async (): Promise<User[]> => {
  const response: AxiosResponse<{
    data: UserResource[];
  }> = await jsonAPIClient.get(`users`);
  const { data } = response.data;
  return data.map((resource: UserResource) => {
    return parseUserFromResource(resource);
  });
};

export const createUser = async (user: User): Promise<User> => {
  await client.get("/csrf-cookie");
  const userResource: UserResource = makeUserResource(user);
  const response: AxiosResponse<{
    data: UserResource;
  }> = await jsonAPIClient.post(`/users`, {
    data: userResource,
  });
  const { data } = response.data;
  return parseUserFromResource(data);
};

export const updateUser = async (user: User): Promise<User> => {
  await client.get("/csrf-cookie");
  const userResource: UserResource = makeUserResource(user);
  const response: AxiosResponse<{
    data: UserResource;
  }> = await jsonAPIClient.patch(`/users/${user.id}`, {
    data: userResource,
  });
  const { data } = response.data;
  return parseUserFromResource(data);
};

export const deleteUser = async (user: User): Promise<User> => {
  await client.get("/csrf-cookie");
  await jsonAPIClient.delete(`/users/${user.id}`);
  return user;
};

export const fetchTimesheets = async (user: User): Promise<Timesheet[]> => {
  const response: AxiosResponse<{
    data: TimesheetResource[];
    included?: (ShiftResource | AbsenceResource)[];
  }> = await jsonAPIClient.get(`users/${user.id}/timesheets`, {
    params: {
      include: "shifts,absences",
      sort: "-created-at",
    },
  });
  const { data, included } = response.data;

  const shiftResources =
    included !== undefined
      ? (included.filter(({ type }) => type === "shifts") as ShiftResource[])
      : [];

  const absenceResources =
    included !== undefined
      ? (included.filter(
          ({ type }) => type === "absences"
        ) as AbsenceResource[])
      : [];

  const allShifts = shiftResources.map((shiftResource) =>
    parseShift(shiftResource)
  );
  const allAbsences = absenceResources.map((absenceResource) =>
    parseAbsence(absenceResource)
  );

  const timesheets = data.map((resource: TimesheetResource) => {
    const timesheet = parseTimesheet(user.id as string, resource);
    const relatedShiftResources = resource.relationships.shifts;
    const relatedAbsenceResources = resource.relationships.absences;
    if (relatedShiftResources !== undefined) {
      const shiftIds = relatedShiftResources.data.map(({ id }) => id);
      const shifts = orderBy(
        allShifts.filter(({ id }) => shiftIds.includes(id as string)),
        "start",
        "asc"
      );
      timesheet.shifts = shifts;
    }
    if (relatedAbsenceResources !== undefined) {
      const absenceIds = relatedAbsenceResources.data.map(({ id }) => id);
      const absences = orderBy(
        allAbsences.filter(({ id }) => absenceIds.includes(id as string)),
        "date",
        "asc"
      );
      timesheet.absences = absences;
    }
    return timesheet;
  });

  return timesheets;
};

export const createShifts = async (
  shifts: Shift[],
  timesheet: Timesheet
): Promise<Shift[]> => {
  await client.get("/csrf-cookie");
  const shiftResources: ShiftResource[] = shifts.map((shift) =>
    makeShiftResource(shift, timesheet)
  );
  const createdShifts = await Promise.all(
    shiftResources.map(async (shiftResource) => {
      const response: AxiosResponse<{
        data: ShiftResource;
      }> = await jsonAPIClient.post(`/shifts`, {
        data: shiftResource,
      });
      const { data } = response.data;
      return parseShift(data);
    })
  );
  return createdShifts;
};

export const createAbsences = async (
  absences: Absence[],
  timesheet: Timesheet
): Promise<Absence[]> => {
  await client.get("/csrf-cookie");
  const absenceResources: AbsenceResource[] = absences.map((absence) =>
    makeAbsenceResource(absence, timesheet)
  );
  const createdAbsences = await Promise.all(
    absenceResources.map(async (absenceResource) => {
      const response: AxiosResponse<{
        data: AbsenceResource;
      }> = await jsonAPIClient.post(`/absences`, {
        data: absenceResource,
      });
      const { data } = response.data;
      return parseAbsence(data);
    })
  );
  return createdAbsences;
};

export const createTimesheet = async (
  timesheet: Timesheet
): Promise<Timesheet> => {
  await client.get("/csrf-cookie");
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
  await client.get("/csrf-cookie");
  await jsonAPIClient.delete(`/timesheets`);
  return timesheet;
};

export const fetchSettings = async (): Promise<Setting[]> => {
  const response: AxiosResponse<{
    data: SettingResource[];
  }> = await jsonAPIClient.get(`settings`);
  const { data } = response.data;
  return data.map((resource: SettingResource) => {
    const { id } = resource;
    const { name, value, changed, created } = resource.attributes;
    return { id, name, value, changed, created };
  });
};

export const fetchUnrestrictedSettings = async (): Promise<Setting[]> => {
  const response: AxiosResponse<{
    data: SettingResource[];
  }> = await jsonAPIClient.get(`settings`, {
    params: {
      "filter[is_restricted]": 0,
    },
  });
  const { data } = response.data;
  return data.map((resource: SettingResource) => {
    const { id } = resource;
    const { name, value, changed, created } = resource.attributes;
    return { id, name, value, changed, created };
  });
};

export const completeTimesheet = async (
  timesheet: Timesheet
): Promise<Timesheet> => {
  await client.get("/csrf-cookie");
  await client.post(`/timesheets/${timesheet.id}/complete`);
  return timesheet;
};

export const updateSettings = async (
  settings: Setting[]
): Promise<Setting[]> => {
  return await Promise.all(
    settings.map(async (setting) => {
      await client.get("/csrf-cookie");
      const response: AxiosResponse<{
        data: SettingResource;
      }> = await jsonAPIClient.patch(`settings/${setting.id}`, {
        data: makeSettingResource(setting),
      });
      const { data } = response.data;
      return parseSetting(data);
    })
  );
};

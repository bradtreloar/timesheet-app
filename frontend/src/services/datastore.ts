import axios, { AxiosResponse } from "axios";
import { User } from "../types";

const HOST = "https://timesheet.allbizsupplies.biz";

export const client = axios.create({
  baseURL: `${HOST}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const jsonApiClient = axios.create({
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

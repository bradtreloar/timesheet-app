import axios, { AxiosResponse } from "axios";
import { User } from "../types";
import FormData from "form-data";

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

const login = async (email: string, password: string): Promise<User> => {
  await client.get("/sanctum/csrf-cookie");
  const response: AxiosResponse<User> = await client.post("/api/v1/login", {
    email, password
  });
  return response.data;
};

const logout = async () => {
  await client.get("/api/v1/logout");
};

export { login, logout };

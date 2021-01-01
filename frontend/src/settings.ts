export const HOST =
  process?.env?.NODE_ENV === "development"
    ? "http://localhost"
    : "https://timesheet.allbizsupplies.biz";

export const API_HOST =
  process?.env?.NODE_ENV === "development"
    ? "http://localhost"
    : "https://api.timesheet.allbizsupplies.biz";

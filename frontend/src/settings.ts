export const HOST =
  process?.env?.NODE_ENV === "development"
    ? "http://localhost"
    : "https://timesheet.allbizsupplies.biz";

export const FIRST_DAY_OF_WEEK = 0;

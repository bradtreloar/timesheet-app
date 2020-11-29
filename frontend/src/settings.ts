export const HOST =
  process?.env?.NODE_ENV === "development"
    ? "http://localhost"
    : "https://timesheet.allbizsupplies.biz";

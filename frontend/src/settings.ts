export const HOST =
  process?.env?.NODE_ENV === "development"
    ? "https://timesheet.allbizsupplies.biz"
    : "localhost";

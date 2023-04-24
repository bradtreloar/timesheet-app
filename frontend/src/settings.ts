export const HOST =
  process?.env?.REACT_APP_ENV === "dev"
    ? "http://localhost:8000"
    : "https://timesheet.allbizsupplies.biz";

export const API_HOST =
  process?.env?.REACT_APP_ENV === "dev"
    ? "http://localhost"
    : "https://api.timesheet.allbizsupplies.biz";

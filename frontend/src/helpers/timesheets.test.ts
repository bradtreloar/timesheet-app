import { randomTimesheet, randomUser } from "fixtures/random";
import { isRepeatTimesheet, getWeekStartDate } from "helpers/timesheet";
import store from "store";
import { setTimesheets } from "store/timesheets";

describe("getWeekStartDate", () => {
  test("get first day of week", () => {
    const testUser = randomUser();
    const timesheet1 = randomTimesheet(testUser);

    const datetime = getWeekStartDate(timesheet1);
    expect(datetime.weekday).toBe(1);
  });
});

describe("isRepeatTimesheet", () => {
  test("detects repeat timesheets", () => {
    const testUser = randomUser();
    const timesheet1 = randomTimesheet(testUser);
    const timesheet2 = randomTimesheet(testUser);
    store.dispatch(setTimesheets([timesheet1]));
    const result = isRepeatTimesheet(timesheet2);
    expect(result).toBe(true);
  });
});

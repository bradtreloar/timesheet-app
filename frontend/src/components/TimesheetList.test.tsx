import React from "react";
import { render, screen } from "@testing-library/react";
import TimesheetList from "./TimesheetList";
import { randomTimesheets, randomUser } from "../fixtures/random";
import { formattedDate } from "../helpers/date"

test("renders timesheet list", () => {
  const testUser = randomUser();
  const testTimesheets = randomTimesheets(testUser, 10);
  render(<TimesheetList timesheets={testTimesheets} />);

  testTimesheets.forEach((timesheet) => {
    const created = new Date(timesheet.created as string);
    const date = formattedDate(created)
    screen.getAllByText(date);
  });
});

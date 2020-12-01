import React from "react";
import { render, screen } from "@testing-library/react";
import TimesheetTable from "./TimesheetTable";
import { randomTimesheets, randomUser } from "fixtures/random";
import { formattedDate, getTimesheetTotalHours } from "services/date";
import { MemoryRouter } from "react-router";

test("renders timesheet list", () => {
  const testUser = randomUser();
  const testTimesheets = randomTimesheets(testUser, 10);
  render(
    <MemoryRouter>
      <TimesheetTable timesheets={testTimesheets} />
    </MemoryRouter>
  );

  testTimesheets.forEach((timesheet) => {
    const created = new Date(timesheet.created as string);
    screen.getAllByText(formattedDate(created));
    screen.getAllByText(getTimesheetTotalHours(timesheet));
  });
});

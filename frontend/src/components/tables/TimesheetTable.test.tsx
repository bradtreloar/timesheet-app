import React from "react";
import { render, screen } from "@testing-library/react";
import TimesheetTable from "./TimesheetTable";
import { randomTimesheets, randomUser } from "fixtures/random";
import { getTimesheetTotalHours } from "services/date";
import { MemoryRouter } from "react-router";
import { DateTime } from "luxon";

test("renders timesheet list", () => {
  const testUser = randomUser();
  const testTimesheets = randomTimesheets(testUser, 10);
  render(
    <MemoryRouter>
      <TimesheetTable timesheets={testTimesheets} />
    </MemoryRouter>
  );

  testTimesheets.forEach((timesheet) => {
    screen.getAllByText(
      DateTime.fromISO(timesheet.created as string).toLocaleString(
        DateTime.DATE_SHORT
      )
    );
    screen.getAllByText(new RegExp(getTimesheetTotalHours(timesheet)));
  });
});

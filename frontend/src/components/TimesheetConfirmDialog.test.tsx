import { render, screen } from "@testing-library/react";
import { randomTimesheet, randomUser } from "fixtures/random";
import { noop } from "lodash";
import React from "react";
import TimesheetConfirmDialog from "components/TimesheetConfirmDialog";
import userEvent from "@testing-library/user-event";

test("calls onConfirm callback when submit button is clicked", (done) => {
  const testTimesheet = randomTimesheet(randomUser());

  render(
    <TimesheetConfirmDialog
      onConfirm={done}
      onCancel={noop}
      timesheet={testTimesheet}
      isRepeatTimesheet={false}
    />
  );

  userEvent.click(screen.getByText(/^submit$/i));
});

test("calls onCancel callback when cancel button is clicked", (done) => {
  const testTimesheet = randomTimesheet(randomUser());

  render(
    <TimesheetConfirmDialog
      onConfirm={noop}
      onCancel={done}
      timesheet={testTimesheet}
      isRepeatTimesheet={false}
    />
  );

  userEvent.click(screen.getByText(/^cancel$/i));
});

test("notifies user when timesheet is a repeat", () => {
  const testTimesheet = randomTimesheet(randomUser());

  render(
    <TimesheetConfirmDialog
      onConfirm={noop}
      onCancel={noop}
      timesheet={testTimesheet}
      isRepeatTimesheet={true}
    />
  );

  screen.getByText(/already submitted/i);
  screen.getByText(/^submit again$/i);
});

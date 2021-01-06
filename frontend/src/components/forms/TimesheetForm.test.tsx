import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimesheetForm from "./TimesheetForm";
import { randomShiftTimesArray } from "fixtures/random";
import randomstring from "randomstring";
import { enterShiftTimes, eraseShiftTimes } from "fixtures/userInput";
import { expectTimesEqual, expectValidShift } from "fixtures/expect";
import { noop, range } from "lodash";
import { ShiftTimes } from "types";
import { DateTime } from "luxon";

export const EMPTY_SHIFT_TIMES = {
  isActive: false,
  startTime: { hour: "", minute: "" },
  endTime: { hour: "", minute: "" },
  breakDuration: { hour: "", minute: "" },
} as ShiftTimes;

const paddedValue = (value: string) =>
  value === "" ? value : value.padStart(2, "0");

const testWeekStartDateTime = DateTime.local();

test("renders", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDateTime={testWeekStartDateTime}
      defaultShifts={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShifts={noop}
    />
  );

  const shiftInputs = screen.getAllByLabelText(/^shift$/i);
  shiftInputs.forEach((shiftInput, index) => {
    const testShiftTimes = testShifts[index];
    const startTimeInput = within(shiftInput).getByLabelText(/start/i);
    expect(within(startTimeInput).getByLabelText(/hour/i)).toHaveValue(
      testShiftTimes.startTime.hour
    );
    expect(within(startTimeInput).getByLabelText(/minute/i)).toHaveValue(
      paddedValue(testShiftTimes.startTime.minute)
    );
  });
});

test("toggles shift time input when shift checkbox is clicked", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDateTime={testWeekStartDateTime}
      defaultShifts={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShifts={noop}
    />
  );

  const shiftInput = screen.getAllByLabelText(/^shift$/i)[0];
  within(shiftInput).getByLabelText(/start/i);
  userEvent.click(within(shiftInput).getByTestId("shift-0-toggle"));
  expect(within(shiftInput).queryByLabelText(/start/i)).toBeNull();
  userEvent.click(within(shiftInput).getByTestId("shift-0-toggle"));
  within(shiftInput).getByLabelText(/start/i);
  expect(
    within(within(shiftInput).getByLabelText(/start/i))
      .getByLabelText(/hour/i)
      .getAttribute("value")
  ).toEqual("");
});

test("handles erasing and re-entering shift times", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDateTime={testWeekStartDateTime}
      defaultShifts={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShifts={noop}
    />
  );

  const shiftInputs = screen.getAllByLabelText(/^shift$/i);
  for (let index in shiftInputs) {
    const shiftInput = shiftInputs[index];
    const testshiftTimes = testShifts[index];
    eraseShiftTimes(shiftInput);
    expectTimesEqual(shiftInput, EMPTY_SHIFT_TIMES);
    enterShiftTimes(shiftInput, testshiftTimes);
    expectTimesEqual(shiftInput, testshiftTimes);
  }
});

describe("calls timesheet submit handler when submit button clicked", () => {
  test("with all shifts active", (done) => {
    const testShifts = randomShiftTimesArray();
    render(
      <TimesheetForm
        defaultWeekStartDateTime={testWeekStartDateTime}
        defaultShifts={testShifts}
        onSubmitTimesheet={({ shifts }) => {
          expect(shifts.length).toEqual(testShifts.length);
          shifts.forEach((shift) => expectValidShift(shift));
          done();
        }}
        onSubmitDefaultShifts={noop}
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
  });

  test("with only some shifts active", (done) => {
    const testShifts = randomShiftTimesArray();
    testShifts.pop();
    testShifts.push(EMPTY_SHIFT_TIMES);
    render(
      <TimesheetForm
        defaultWeekStartDateTime={testWeekStartDateTime}
        defaultShifts={testShifts}
        onSubmitTimesheet={({ shifts }) => {
          expect(shifts.length).toEqual(testShifts.length - 1);
          shifts.forEach((shift) => expectValidShift(shift));
          done();
        }}
        onSubmitDefaultShifts={noop}
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
  });
});

describe("displays errors when invalid input is entered", () => {
  test("with no shifts active", () => {
    const testShifts = range(7).map(() => EMPTY_SHIFT_TIMES);
    render(
      <TimesheetForm
        defaultWeekStartDateTime={testWeekStartDateTime}
        defaultShifts={testShifts}
        onSubmitTimesheet={() => {
          throw new Error(
            `onSubmitTimesheet should not be called with no shifts.`
          );
        }}
        onSubmitDefaultShifts={noop}
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
    screen.getByText(/at least one shift is required/i);
  });

  test("with incomplete shift", () => {
    const testShifts: ShiftTimes[] = randomShiftTimesArray();
    testShifts[0].breakDuration = {
      hour: "",
      minute: "",
    };
    render(
      <TimesheetForm
        defaultWeekStartDateTime={testWeekStartDateTime}
        defaultShifts={testShifts}
        onSubmitTimesheet={() => {
          throw new Error(
            `onSubmitTimesheet should not be called with invalid shift time.`
          );
        }}
        onSubmitDefaultShifts={noop}
      />
    );
    expect(screen.queryByText(/enter time/i)).toBeNull();
    userEvent.click(screen.getByText(/^submit$/i));
    expect(screen.getAllByText(/required/i)).toHaveLength(2);
  });

  test("with invalid comment length", () => {
    const testShifts = randomShiftTimesArray();
    render(
      <TimesheetForm
        defaultWeekStartDateTime={testWeekStartDateTime}
        defaultShifts={testShifts}
        onSubmitTimesheet={() => {
          throw new Error(
            `onSubmitTimesheet should not be called with invalid comment length.`
          );
        }}
        onSubmitDefaultShifts={noop}
      />
    );
    userEvent.type(screen.getByLabelText(/comment/i), randomstring.generate(300))
    userEvent.click(screen.getByText(/^submit$/i));
  });
});

test("calls default shifts submit handler when \"save defaults\" button is clicked", (done) => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDateTime={testWeekStartDateTime}
      defaultShifts={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShifts={(defaultShifts) => {
        expect(defaultShifts).toEqual(testShifts);
        done();
      }}
    />
  );
  userEvent.click(screen.getByText(/^save these shifts as my default$/i));
});

test("disables form controls when pending prop is true", () => {
  const testShifts: ShiftTimes[] = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDateTime={testWeekStartDateTime}
      defaultShifts={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShifts={noop}
      pending
    />
  );

  screen.getByText(/submitting/i);
});

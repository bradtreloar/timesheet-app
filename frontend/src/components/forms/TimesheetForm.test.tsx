import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimesheetForm from "./TimesheetForm";
import { randomReason, randomShiftValuesArray } from "fixtures/random";
import randomstring from "randomstring";
import { enterShiftValues, eraseShiftValues } from "fixtures/userInput";
import { expectTimesEqual, expectValidShift } from "fixtures/expect";
import { noop, range } from "lodash";
import { ShiftValues } from "types";
import { DateTime } from "luxon";

export const EMPTY_SHIFT_TIMES = {
  isActive: false,
  reason: "rostered-day-off",
  startTime: { hour: "", minute: "" },
  endTime: { hour: "", minute: "" },
  breakDuration: { hour: "", minute: "" },
} as ShiftValues;

const paddedValue = (value: string) =>
  value === "" ? value : value.padStart(2, "0");

const testWeekStartDateTime = DateTime.local();

test("renders", () => {
  const testShifts = randomShiftValuesArray();
  render(
    <TimesheetForm
      defaultShiftValues={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShiftValues={noop}
    />
  );

  const shiftInputs = screen.getAllByLabelText(/^shift$/i);
  shiftInputs.forEach((shiftInput, index) => {
    const testShiftValues = testShifts[index];
    const startTimeInput = within(shiftInput).getByLabelText(/start/i);
    expect(within(startTimeInput).getByLabelText(/hour/i)).toHaveValue(
      testShiftValues.startTime.hour
    );
    expect(within(startTimeInput).getByLabelText(/minute/i)).toHaveValue(
      paddedValue(testShiftValues.startTime.minute)
    );
  });
});

test("toggles shift time input when shift checkbox is clicked", () => {
  const testShifts = randomShiftValuesArray();
  render(
    <TimesheetForm
      defaultShiftValues={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShiftValues={noop}
    />
  );

  const shiftInput = screen.getAllByLabelText(/^shift$/i)[0];
  within(shiftInput).getByLabelText(/start/i);
  const checkbox = within(shiftInput).getByTestId("shift-0-toggle");
  // Toggle shift off.
  userEvent.click(checkbox);
  expect(within(shiftInput).queryByLabelText(/start/i)).toBeNull();
  within(shiftInput).getByLabelText(/reason/i);
  within(shiftInput).getByText(/select a reason/i);
  // Toggle shift on.
  userEvent.click(checkbox);
  within(shiftInput).getByLabelText(/start/i);
  expect(
    within(within(shiftInput).getByLabelText(/start/i))
      .getByLabelText(/hour/i)
      .getAttribute("value")
  ).toEqual("");
});

test("handles erasing and re-entering shift times", () => {
  const testShifts = randomShiftValuesArray();
  render(
    <TimesheetForm
      defaultShiftValues={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShiftValues={noop}
    />
  );

  const shiftInputs = screen.getAllByLabelText(/^shift$/i);
  for (let index in shiftInputs) {
    const shiftInput = shiftInputs[index];
    const testShiftValues = testShifts[index];
    eraseShiftValues(shiftInput);
    expectTimesEqual(shiftInput, EMPTY_SHIFT_TIMES);
    enterShiftValues(shiftInput, testShiftValues);
    expectTimesEqual(shiftInput, testShiftValues);
  }
});

describe("calls timesheet submit handler when submit button clicked", () => {
  test("with all shifts active", (done) => {
    const testShifts = randomShiftValuesArray();
    render(
      <TimesheetForm
        defaultShiftValues={testShifts}
        onSubmitTimesheet={({ shifts }) => {
          expect(shifts.length).toEqual(testShifts.length);
          shifts.forEach((shift) => expectValidShift(shift));
          done();
        }}
        onSubmitDefaultShiftValues={noop}
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
  });

  test("with only some shifts active", (done) => {
    const testShifts = randomShiftValuesArray();
    testShifts.pop();
    testShifts.push(EMPTY_SHIFT_TIMES);
    render(
      <TimesheetForm
        defaultShiftValues={testShifts}
        onSubmitTimesheet={({ shifts }) => {
          expect(shifts.length).toEqual(testShifts.length - 1);
          shifts.forEach((shift) => expectValidShift(shift));
          done();
        }}
        onSubmitDefaultShiftValues={noop}
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
  });
});

describe("displays errors when invalid input is entered", () => {
  test("with incomplete shift", () => {
    const testShifts: ShiftValues[] = randomShiftValuesArray();
    testShifts[0].breakDuration = {
      hour: "",
      minute: "",
    };
    render(
      <TimesheetForm
        defaultShiftValues={testShifts}
        onSubmitTimesheet={() => {
          throw new Error(
            `onSubmitTimesheet should not be called with invalid shift time.`
          );
        }}
        onSubmitDefaultShiftValues={noop}
      />
    );
    expect(screen.queryByText(/enter time/i)).toBeNull();
    userEvent.click(screen.getByText(/^submit$/i));
    expect(screen.getAllByText(/required/i)).toHaveLength(2);
  });

  test("with invalid comment length", () => {
    const testShifts = randomShiftValuesArray();
    render(
      <TimesheetForm
        defaultShiftValues={testShifts}
        onSubmitTimesheet={() => {
          throw new Error(
            `onSubmitTimesheet should not be called with invalid comment length.`
          );
        }}
        onSubmitDefaultShiftValues={noop}
      />
    );
    userEvent.type(
      screen.getByLabelText(/comment/i),
      randomstring.generate(300)
    );
    userEvent.click(screen.getByText(/^submit$/i));
  });
});

test('calls default shifts submit handler when "save defaults" button is clicked', (done) => {
  const testShifts = randomShiftValuesArray();
  render(
    <TimesheetForm
      defaultShiftValues={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShiftValues={(defaultShiftValues) => {
        expect(defaultShiftValues).toEqual(testShifts);
        done();
      }}
    />
  );
  userEvent.click(screen.getByText(/^save these shifts as my default$/i));
});

test("disables form controls when pending prop is true", () => {
  const testShifts: ShiftValues[] = randomShiftValuesArray();
  render(
    <TimesheetForm
      defaultShiftValues={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShiftValues={noop}
      pending
    />
  );

  screen.getByText(/submitting/i);
});

test('hides "save default shifts" button when shift times are not valid', () => {
  const testShifts: ShiftValues[] = randomShiftValuesArray();

  render(
    <TimesheetForm
      defaultShiftValues={testShifts}
      onSubmitTimesheet={noop}
      onSubmitDefaultShiftValues={noop}
    />
  );

  const shiftInput = screen.getAllByLabelText(/^shift$/i)[0];
  const startTimeInput = within(shiftInput).getByLabelText(/start/i);
  userEvent.clear(within(startTimeInput).getByLabelText(/hour/i));
  userEvent.clear(within(startTimeInput).getByLabelText(/minute/i));

  expect(screen.queryByText(/^save these shifts as my default$/i)).toBeNull();
});

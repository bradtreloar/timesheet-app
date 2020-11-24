import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimesheetForm, { shiftInputNames } from "./TimesheetForm";
import { randomShiftTimesArray } from "../fixtures/random";
import { enterShiftTimes, eraseShiftTimes } from "../fixtures/actions";
import { expectTimesEqual, expectValidShift } from "../fixtures/expect";
import { noop, range } from "lodash";
import { Shift, ShiftTimes } from "../types";

export const EMPTY_SHIFT_TIMES = {
  startTime: { hours: "", minutes: "" },
  endTime: { hours: "", minutes: "" },
  breakDuration: { hours: "", minutes: "" },
} as ShiftTimes;

const testWeekStartDate = new Date();

test("renders timesheet form", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDate={testWeekStartDate}
      defaultShifts={testShifts}
      onSubmit={noop}
    />
  );

  const shiftInputs = screen.getAllByLabelText(/^shift$/i);
  shiftInputs.forEach((shiftInput, index) => {
    const testShiftTimes = testShifts[index];
    const startTimeInput = within(shiftInput).getByLabelText(/start time/i);
    expect(within(startTimeInput).getByLabelText(/hours/i)).toHaveValue(
      testShiftTimes.startTime.hours
    );
    expect(within(startTimeInput).getByLabelText(/minutes/i)).toHaveValue(
      testShiftTimes.startTime.minutes
    );
  });
});

test("handles toggling shift", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDate={testWeekStartDate}
      defaultShifts={testShifts}
      onSubmit={noop}
    />
  );

  const shiftInput = screen.getAllByLabelText(/^shift$/i)[0];
  within(shiftInput).getByLabelText(/start time/i);
  userEvent.click(within(shiftInput).getByTestId("shift-toggle"));
  expect(within(shiftInput).queryByLabelText(/start time/i)).toBeNull();
  userEvent.click(within(shiftInput).getByTestId("shift-toggle"));
  within(shiftInput).getByLabelText(/start time/i);
  expect(
    within(within(shiftInput).getByLabelText(/start time/i))
      .getByLabelText(/hours/i)
      .getAttribute("value")
  ).toEqual("");
});

test("handles erasing times", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDate={testWeekStartDate}
      defaultShifts={testShifts}
      onSubmit={noop}
    />
  );

  for (let shiftInput of screen.getAllByLabelText(/^shift$/i)) {
    eraseShiftTimes(shiftInput);
    expectTimesEqual(shiftInput, EMPTY_SHIFT_TIMES);
  }
});

test("handles entering times", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDate={testWeekStartDate}
      defaultShifts={testShifts}
      onSubmit={noop}
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

describe("form submission", () => {
  test("with all shifts", (done) => {
    const testShifts = randomShiftTimesArray();
    render(
      <TimesheetForm
        defaultWeekStartDate={testWeekStartDate}
        defaultShifts={testShifts}
        onSubmit={(shifts: Shift[]) => {
          expect(shifts.length).toEqual(testShifts.length);
          shifts.forEach((shift) => expectValidShift(shift));
          done();
        }}
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
  });

  test("with only some shifts", (done) => {
    const testShifts: (ShiftTimes | null)[] = randomShiftTimesArray();
    testShifts.pop();
    testShifts.push(null);
    render(
      <TimesheetForm
        defaultWeekStartDate={testWeekStartDate}
        defaultShifts={testShifts}
        onSubmit={(shifts: Shift[]) => {
          expect(shifts.length).toEqual(testShifts.length - 1);
          shifts.forEach((shift) => expectValidShift(shift));
          done();
        }}
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
  });

  test("with no shifts", () => {
    const testShifts: null[] = range(7).map(() => null);
    render(
      <TimesheetForm
        defaultWeekStartDate={testWeekStartDate}
        defaultShifts={testShifts}
        onSubmit={(shifts: Shift[]) => {
          throw new Error(`onSubmit should not be called with no shifts.`);
        }}
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
    screen.getByText(/at least one shift is required/i);
  });

  test("with incomplete shift", () => {
    const testShifts: ShiftTimes[] = randomShiftTimesArray();
    testShifts[0].breakDuration = {
      hours: "",
      minutes: "",
    };
    render(
      <TimesheetForm
        defaultWeekStartDate={testWeekStartDate}
        defaultShifts={testShifts}
        onSubmit={() => {
          throw new Error(
            `onSubmit should not be called with invalid shift time.`
          );
        }}
      />
    );
    expect(screen.queryByText(/enter time/i)).toBeNull();
    userEvent.click(screen.getByText(/^submit$/i));
    expect(screen.getAllByText(/required/i)).toHaveLength(2);
  });
});

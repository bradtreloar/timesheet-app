import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimesheetForm from "./TimesheetForm";
import { randomShiftTimesArray } from "fixtures/random";
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

const testWeekStartDateTime = DateTime.local();

test("renders timesheet form", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDateTime={testWeekStartDateTime}
      defaultShifts={testShifts}
      onSubmitTimesheet={noop}
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
      testShiftTimes.startTime.minute
    );
  });
});

test("handles toggling shift", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDateTime={testWeekStartDateTime}
      defaultShifts={testShifts}
      onSubmitTimesheet={noop}
    />
  );

  const shiftInput = screen.getAllByLabelText(/^shift$/i)[0];
  within(shiftInput).getByLabelText(/start/i);
  userEvent.click(within(shiftInput).getByTestId("shift-toggle"));
  expect(within(shiftInput).queryByLabelText(/start/i)).toBeNull();
  userEvent.click(within(shiftInput).getByTestId("shift-toggle"));
  within(shiftInput).getByLabelText(/start/i);
  expect(
    within(within(shiftInput).getByLabelText(/start/i))
      .getByLabelText(/hour/i)
      .getAttribute("value")
  ).toEqual("");
});

test("handles erasing times", () => {
  const testShifts = randomShiftTimesArray();
  render(
    <TimesheetForm
      defaultWeekStartDateTime={testWeekStartDateTime}
      defaultShifts={testShifts}
      onSubmitTimesheet={noop}
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
      defaultWeekStartDateTime={testWeekStartDateTime}
      defaultShifts={testShifts}
      onSubmitTimesheet={noop}
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
        defaultWeekStartDateTime={testWeekStartDateTime}
        defaultShifts={testShifts}
        onSubmitTimesheet={({ shifts }) => {
          expect(shifts.length).toEqual(testShifts.length);
          shifts.forEach((shift) => expectValidShift(shift));
          done();
        }}
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
  });

  test("with only some shifts", (done) => {
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
      />
    );
    userEvent.click(screen.getByText(/^submit$/i));
  });

  test("with no shifts", () => {
    const testShifts = range(7).map(() => EMPTY_SHIFT_TIMES);
    render(
      <TimesheetForm
        defaultWeekStartDateTime={testWeekStartDateTime}
        defaultShifts={testShifts}
        onSubmitTimesheet={() => {
          throw new Error(`onSubmitTimesheet should not be called with no shifts.`);
        }}
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
      />
    );
    expect(screen.queryByText(/enter time/i)).toBeNull();
    userEvent.click(screen.getByText(/^submit$/i));
    expect(screen.getAllByText(/required/i)).toHaveLength(2);
  });
});

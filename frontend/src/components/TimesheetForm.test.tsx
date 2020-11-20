import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimesheetForm from "./TimesheetForm";
import { randomShiftTimesArray } from "../fixtures/random";
import { SimpleTime } from "../helpers/date";
import { Shift, ShiftTimes } from "../types";
import { enterShiftTimes, eraseShiftTimes } from "../fixtures/actions";
import { expectTimesEqual, expectValidShift } from "../fixtures/expect";
import { range } from "lodash";
import { EMPTY_SHIFT_TIMES } from "./ShiftInput";

test("renders timesheet form", () => {
  const testShiftTimesArray = randomShiftTimesArray();
  render(
    <TimesheetForm
      allDefaultShiftTimes={testShiftTimesArray}
      onSubmit={() => {}}
    />
  );

  const shiftInputs = screen.getAllByLabelText(/^shift$/i);
  shiftInputs.forEach((shiftInput, index) => {
    const testShiftTimes = testShiftTimesArray[index];
    const startTimeInput = within(shiftInput).getByLabelText(/start time/i);
    const expectedStartTime = testShiftTimes.startTime as SimpleTime;
    const expectedHours = (expectedStartTime.hours as number).toString();
    const expectedMinutes = (expectedStartTime.minutes as number)
      .toString()
      .padStart(2, "0");
    expect(within(startTimeInput).getByLabelText(/hours/i)).toHaveValue(
      expectedHours
    );
    expect(within(startTimeInput).getByLabelText(/minutes/i)).toHaveValue(
      expectedMinutes
    );
  });
});

test("handles toggling shift", () => {
  const testDefaultShiftTimesArray = randomShiftTimesArray();
  render(
    <TimesheetForm
      allDefaultShiftTimes={testDefaultShiftTimesArray}
      onSubmit={() => {}}
    />
  );

  const shiftInput = screen.getAllByLabelText(/^shift$/i)[0];
  within(shiftInput).getByLabelText(/start time/i);
  userEvent.click(within(shiftInput).getByLabelText(/worked/i));
  expect(within(shiftInput).queryByLabelText(/start time/i)).toBeNull();
  userEvent.click(within(shiftInput).getByLabelText(/worked/i));
  within(shiftInput).getByLabelText(/start time/i);
});

test("handles erasing times", () => {
  const testDefaultShiftTimesArray = randomShiftTimesArray();

  render(
    <TimesheetForm
      allDefaultShiftTimes={testDefaultShiftTimesArray}
      onSubmit={() => {}}
    />
  );

  for (let shiftInput of screen.getAllByLabelText(/^shift$/i)) {
    eraseShiftTimes(shiftInput);
    expectTimesEqual(shiftInput, EMPTY_SHIFT_TIMES);
  }
});

test("handles entering times", () => {
  const testDefaultShiftTimesArray = randomShiftTimesArray();
  const testshiftTimesArray = randomShiftTimesArray();

  render(
    <TimesheetForm
      allDefaultShiftTimes={testDefaultShiftTimesArray}
      onSubmit={() => {}}
    />
  );

  const shiftInputs = screen.getAllByLabelText(/^shift$/i);

  for (let index in shiftInputs) {
    const shiftInput = shiftInputs[index];
    const testshiftTimes = testshiftTimesArray[index];
    eraseShiftTimes(shiftInput);
    expectTimesEqual(shiftInput, EMPTY_SHIFT_TIMES);
    enterShiftTimes(shiftInput, testshiftTimes);
    expectTimesEqual(shiftInput, testshiftTimes);
  }
});

describe("form submission", () => {
  test("with all shifts", (done) => {
    const testshiftTimesArray = randomShiftTimesArray();

    render(
      <TimesheetForm
        allDefaultShiftTimes={testshiftTimesArray}
        onSubmit={(shifts: Shift[]) => {
          expect(shifts.length).toEqual(testshiftTimesArray.length);
          shifts.forEach((shift) => expectValidShift(shift));
          done();
        }}
      />
    );

    userEvent.click(screen.getByText(/^submit$/i));
  });

  test("with only some shifts", (done) => {
    const testshiftTimesArray: (ShiftTimes | null)[] = randomShiftTimesArray();
    testshiftTimesArray.pop();
    testshiftTimesArray.push(null);

    render(
      <TimesheetForm
        allDefaultShiftTimes={testshiftTimesArray}
        onSubmit={(shifts: Shift[]) => {
          expect(shifts.length).toEqual(testshiftTimesArray.length - 1);
          shifts.forEach((shift) => expectValidShift(shift));
          done();
        }}
      />
    );

    userEvent.click(screen.getByText(/^submit$/i));
  });

  test("with incomplete shift", () => {
    const testshiftTimesArray: ShiftTimes[] = randomShiftTimesArray();
    testshiftTimesArray[0].breakDuration = new SimpleTime(null, null);

    render(
      <TimesheetForm
        allDefaultShiftTimes={testshiftTimesArray}
        onSubmit={() => {
          throw new Error(`onSubmit should not be called with invalid shift time.`);
        }}
      />
    );

    expect(screen.queryByText(/enter time/i)).toBeNull();
    userEvent.click(screen.getByText(/^submit$/i));
    screen.getByText(/enter time/i);
  });

  test("with no shifts", () => {
    const testshiftTimesArray: null[] = range(7).map(() => null);

    render(
      <TimesheetForm
        allDefaultShiftTimes={testshiftTimesArray}
        onSubmit={(shifts: Shift[]) => {
          throw new Error(`onSubmit should not be called with no shifts.`);
        }}
      />
    );

    userEvent.click(screen.getByText(/^submit$/i));
  });
});

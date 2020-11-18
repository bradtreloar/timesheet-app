import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimesheetForm, { EMPTY_SHIFT_TIMES } from "./TimesheetForm";
import { randomShiftTimesArray } from "../fixtures/random";
import { SimpleTime } from "../helpers/date";
import { Shift, ShiftTimes } from "../types";
import { enterShiftTimes, eraseShiftTimes } from "../fixtures/actions";
import { expectTimesEqual } from "../fixtures/expect";

test("renders timesheet form", () => {
  const testShiftTimesArray = randomShiftTimesArray();
  render(<TimesheetForm allDefaultShiftTimes={testShiftTimesArray} />);

  const shiftInputs = screen.getAllByLabelText(/^shift$/i);
  shiftInputs.forEach((shiftInput, index) => {
    const testShiftTimes = testShiftTimesArray[index];
    const startTimeInput = within(shiftInput).getByLabelText(/start time/i);
    const expectedStartTime = testShiftTimes.startTime as SimpleTime;
    const expectedHours = (expectedStartTime.hours as number).toString();
    const expectedMinutes = (expectedStartTime.minutes as number).toString().padStart(2, "0");
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
  render(<TimesheetForm allDefaultShiftTimes={testDefaultShiftTimesArray} />);

  const shiftInput = screen.getAllByLabelText(/^shift$/i)[0];
  within(shiftInput).getByLabelText(/start time/i);
  userEvent.click(within(shiftInput).getByLabelText(/worked/i));
  expect(within(shiftInput).queryByLabelText(/start time/i)).toBeNull();
  userEvent.click(within(shiftInput).getByLabelText(/worked/i));
  within(shiftInput).getByLabelText(/start time/i);
});

test("handles erasing times", () => {
  const testDefaultShiftTimesArray = randomShiftTimesArray();

  render(<TimesheetForm allDefaultShiftTimes={testDefaultShiftTimesArray} />);

  for (let shiftInput of screen.getAllByLabelText(/^shift$/i)) {
    eraseShiftTimes(shiftInput);
    expectTimesEqual(shiftInput, EMPTY_SHIFT_TIMES);
  }
});

test("handles entering times", () => {
  const testDefaultShiftTimesArray = randomShiftTimesArray();
  const testshiftTimesArray = randomShiftTimesArray();

  render(<TimesheetForm allDefaultShiftTimes={testDefaultShiftTimesArray} />);

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

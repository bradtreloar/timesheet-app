import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShiftInput from "./ShiftInput";
import { randomShiftTimes, randomTimeInputError } from "../fixtures/random";
import { longFormatDate, SimpleTime } from "../helpers/date";
import { expectTimesEqual } from "../fixtures/expect";
import { enterShiftTimes } from "../fixtures/actions";
import { getShiftDuration } from "../helpers/shift";
import { noop } from "lodash";
import { EMPTY_SHIFT_TIMES } from "./TimesheetForm";

test("renders date label and toggler", () => {
  const testShiftTimes = randomShiftTimes();
  const testDate = new Date();
  const label = longFormatDate(testDate);

  render(
    <ShiftInput
      date={testDate}
      value={testShiftTimes}
      onChange={noop}
      onToggle={noop}
    />
  );

  screen.getByLabelText(new RegExp(label));
  screen.getByLabelText(/worked/i);
});

test("renders null time inputs", () => {
  const testDate = new Date();

  render(
    <ShiftInput
      date={testDate}
      value={EMPTY_SHIFT_TIMES}
      onChange={noop}
      onToggle={noop}
    />
  );

  expectTimesEqual(screen.getByLabelText(/shift$/i), EMPTY_SHIFT_TIMES);
});

test("renders filled time inputs", () => {
  const testDate = new Date();
  const testShiftTimes = randomShiftTimes();

  render(
    <ShiftInput
      date={testDate}
      value={testShiftTimes}
      onChange={noop}
      onToggle={noop}
    />
  );

  expectTimesEqual(screen.getByLabelText(/shift$/i), testShiftTimes);
});

test("renders error messages", () => {
  const testDate = new Date();
  const testShiftTimes = randomShiftTimes();
  const testErrors = {
    startTime: randomTimeInputError(),
    endTime: randomTimeInputError(),
    breakDuration: randomTimeInputError(),
  }

  render(
    <ShiftInput
      date={testDate}
      errors={testErrors}
      value={testShiftTimes}
      onChange={noop}
      onToggle={noop}
    />
  );

  screen.getByText(testErrors.startTime.message);
  screen.getByText(testErrors.endTime.message);
  screen.getByText(testErrors.breakDuration.message);
});

test("handles time inputs", () => {
  const testDate = new Date();
  const testShiftTimes = randomShiftTimes();
  const onChange = jest.fn();

  render(
    <ShiftInput
      date={testDate}
      value={EMPTY_SHIFT_TIMES}
      onChange={onChange}
      onToggle={noop}
    />
  );

  const shiftInput = screen.getByLabelText(/shift$/i);
  enterShiftTimes(shiftInput, testShiftTimes);
  expectTimesEqual(shiftInput, EMPTY_SHIFT_TIMES);
});

test("handles shift toggle", () => {
  const testDate = new Date();
  const onChange = jest.fn();
  const onToggle = jest.fn();

  render(
    <ShiftInput
      date={testDate}
      value={null}
      onChange={onChange}
      onToggle={onToggle}
    />
  );

  userEvent.click(screen.getByLabelText(/worked/i));
  expect(onToggle).toBeCalledTimes(1);
});

test("validates shift duration", () => {
  const testDate = new Date();
  const testShiftTimes = randomShiftTimes();
  const shiftDuration = getShiftDuration(testShiftTimes) as number;

  render(
    <ShiftInput
      date={testDate}
      value={testShiftTimes}
      onChange={noop}
      onToggle={noop}
    />
  );

  expect(screen.getByLabelText(/shift duration/i)).toHaveTextContent(
    shiftDuration.toFixed(2)
  );
});

test("handles invalid shift times", () => {
  const testDate = new Date();
  const testShiftTimes = randomShiftTimes();
  testShiftTimes.endTime = new SimpleTime(null, null);

  render(
    <ShiftInput
      date={testDate}
      value={testShiftTimes}
      onChange={noop}
      onToggle={noop}
    />
  );

  expect(screen.getByLabelText(/shift duration/i)).toHaveTextContent("N/A");
});

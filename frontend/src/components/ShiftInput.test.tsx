import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShiftInput from "./ShiftInput";
import {
  randomShiftTimes
} from "../fixtures/random";
import { longFormatDate } from "../helpers/date";
import { ShiftTimes } from "../types";
import { expectTimesEqual } from "../fixtures/expect";
import { enterShiftTimes } from "../fixtures/actions";

const EMPTY_SHIFT_TIMES = {
  startTime: null,
  endTime: null,
  breakDuration: null,
} as ShiftTimes;

test("renders date label and toggler", () => {
  const testShiftTimes = randomShiftTimes();
  const testDate = new Date();
  const label = longFormatDate(testDate);

  render(
    <ShiftInput
      date={testDate}
      shiftTimes={testShiftTimes}
      onChange={() => {}}
      onToggle={() => {}}
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
      shiftTimes={EMPTY_SHIFT_TIMES}
      onChange={() => {}}
      onToggle={() => {}}
    />
  );

  expectTimesEqual(screen.getByLabelText(/shift/i), EMPTY_SHIFT_TIMES);
});

test("renders filled time inputs", () => {
  const testDate = new Date();
  const testShiftTimes = randomShiftTimes();

  render(
    <ShiftInput
      date={testDate}
      shiftTimes={testShiftTimes}
      onChange={() => {}}
      onToggle={() => {}}
    />
  );

  expectTimesEqual(screen.getByLabelText(/shift/i), testShiftTimes);
});

test("handles time inputs", () => {
  const testDate = new Date();
  const testShiftTimes = randomShiftTimes();
  const onChange = jest.fn();

  render(
    <ShiftInput
      date={testDate}
      shiftTimes={EMPTY_SHIFT_TIMES}
      onChange={onChange}
      onToggle={() => {}}
    />
  );

  const shiftInput = screen.getByLabelText(/shift/i);
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
      shiftTimes={null}
      onChange={onChange}
      onToggle={onToggle}
    />
  );

  userEvent.click(screen.getByLabelText(/worked/i));
  expect(onToggle).toBeCalledTimes(1);
});

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShiftInput, { TimeInput } from "./ShiftInput";
import {
  randomInt,
  randomShiftTimes,
  randomSimpleTime,
} from "../fixtures/random";
import { longFormatDate, SimpleTime } from "../helpers/date";
import { ShiftTimes } from "../types";

const EMPTY_SHIFT_TIMES = {
  startTime: null,
  endTime: null,
  breakDuration: null,
} as ShiftTimes;

const timeInputs = (shiftTimes: ShiftTimes) => [
  {
    label: /start time/i,
    value: shiftTimes.startTime,
  },
  {
    label: /end time/i,
    value: shiftTimes.endTime,
  },
  {
    label: /break duration/i,
    value: shiftTimes.breakDuration,
  },
];

const expectTimesEqual = (shiftInput: HTMLElement, shiftTimes: ShiftTimes) => {
  for (let { label, value } of timeInputs(shiftTimes)) {
    const timeInput = screen.getByLabelText(label);
    const expectedHours =
      value && value.hours !== null ? value.hours.toString() : "";
    const expectedMinutes =
      value && value.minutes !== null ? value.minutes.toString().padStart(2, "0") : "";
    expect(
      within(timeInput).getByLabelText(/hours/i).getAttribute("value")
    ).toEqual(expectedHours);
    expect(
      within(timeInput)
        .getByLabelText(/minutes/i)
        .getAttribute("value")
    ).toEqual(expectedMinutes);
  }
};

const enterShiftTimes = (shiftInput: HTMLElement, shiftTimes: ShiftTimes) => {
  for (let { label, value } of timeInputs(shiftTimes)) {
    const timeInput = screen.getByLabelText(label);
    if (value !== null) {
      if (value.hours !== null) {
        const hoursInput = within(timeInput).getByLabelText(/hours/i);
        const hoursValue = value.hours.toString();
        userEvent.type(hoursInput, hoursValue);
      }
      if (value.minutes !== null) {
        const minutesInput = within(timeInput).getByLabelText(/hours/i);
        const minutesValue = value.minutes.toString();
        userEvent.type(minutesInput, minutesValue);
      }
    }
  }
};

test("renders date label", () => {
  const testShiftTimes = randomShiftTimes();
  const defaultShiftTimes = randomShiftTimes();
  const testDate = new Date();
  const label = longFormatDate(testDate);
  render(
    <ShiftInput
      date={testDate}
      defaultShiftTimes={defaultShiftTimes}
      shiftTimes={testShiftTimes}
      onChange={() => {}}
    />
  );

  screen.getByLabelText(new RegExp(label));
});

test("renders null time inputs", () => {
  const testDate = new Date();

  render(
    <ShiftInput
      date={testDate}
      defaultShiftTimes={EMPTY_SHIFT_TIMES}
      shiftTimes={EMPTY_SHIFT_TIMES}
      onChange={() => {}}
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
      defaultShiftTimes={EMPTY_SHIFT_TIMES}
      shiftTimes={testShiftTimes}
      onChange={() => {}}
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
      defaultShiftTimes={EMPTY_SHIFT_TIMES}
      shiftTimes={EMPTY_SHIFT_TIMES}
      onChange={onChange}
    />
  );

  const shiftInput = screen.getByLabelText(/shift/i);
  enterShiftTimes(shiftInput, testShiftTimes);
  expectTimesEqual(shiftInput, EMPTY_SHIFT_TIMES);
});

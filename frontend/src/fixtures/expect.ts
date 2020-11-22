import { within } from "@testing-library/react";
import { Shift, ShiftTimes } from "../types";

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

export const expectTimesEqual = (
  shiftInput: HTMLElement,
  shiftTimes: ShiftTimes
) => {
  for (let { label, value } of timeInputs(shiftTimes)) {
    const timeInput = within(shiftInput).getByLabelText(label);
    expect(
      within(timeInput).getByLabelText(/hours/i).getAttribute("value")
    ).toEqual(value.hours);
    expect(
      within(timeInput)
        .getByLabelText(/minutes/i)
        .getAttribute("value")
    ).toEqual(value.minutes);
  }
};

export const expectValidShift = (shift: Shift) => {
  expect(shift.start instanceof Date).toBe(true);
  expect(shift.end instanceof Date).toBe(true);
  expect(typeof shift.breakDuration).toBe("number");
};

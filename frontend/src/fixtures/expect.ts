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
    const expectedHours =
      value && value.hours !== null ? value.hours.toString() : "";
    const expectedMinutes =
      value && value.minutes !== null
        ? value.minutes.toString().padStart(2, "0")
        : "";
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

export const expectValidShift = (shift: Shift) => {
  expect(shift.start instanceof Date).toBe(true);
  expect(shift.end instanceof Date).toBe(true);
  expect(typeof shift.breakDuration).toBe("number");
};

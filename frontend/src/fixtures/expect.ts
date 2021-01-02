import { within } from "@testing-library/react";
import { Shift, ShiftTimes } from "types";

const paddedValue = (value: string) =>
  value === "" ? value : value.padStart(2, "0");

const timeInputs = (shiftTimes: ShiftTimes) => [
  {
    label: /start/i,
    value: shiftTimes.startTime,
  },
  {
    label: /end/i,
    value: shiftTimes.endTime,
  },
  {
    label: /break/i,
    value: shiftTimes.breakDuration,
  },
];

export const expectTimesEqual = (
  shiftInput: HTMLElement,
  shiftTimes: ShiftTimes
) => {
  for (let { label, value } of timeInputs(shiftTimes)) {
    const { hour, minute } = value;
    const timeInput = within(shiftInput).getByLabelText(label);
    expect(
      within(timeInput).getByLabelText(/hour/i).getAttribute("value")
    ).toEqual(hour);
    expect(
      within(timeInput)
        .getByLabelText(/minute/i)
        .getAttribute("value")
    ).toEqual(paddedValue(minute));
  }
};

export const expectValidShift = (shift: Shift) => {
  expect(typeof shift.start).toBe("string");
  expect(typeof shift.end).toBe("string");
  expect(typeof shift.breakDuration).toBe("number");
};

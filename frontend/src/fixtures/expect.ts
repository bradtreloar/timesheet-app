import { within } from "@testing-library/react";
import { Shift, ShiftValues } from "types";

const paddedValue = (value: string) =>
  value === "" ? value : value.padStart(2, "0");

const timeInputs = (shiftValues: ShiftValues) => [
  {
    label: /start/i,
    value: shiftValues.startTime,
  },
  {
    label: /end/i,
    value: shiftValues.endTime,
  },
  {
    label: /break/i,
    value: shiftValues.breakDuration,
  },
];

export const expectTimesEqual = (
  shiftInput: HTMLElement,
  shiftValues: ShiftValues
) => {
  for (let { label, value } of timeInputs(shiftValues)) {
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

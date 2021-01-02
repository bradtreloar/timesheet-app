import { within } from "@testing-library/react";
import { Shift, ShiftTimes } from "types";

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
    const timeInput = within(shiftInput).getByLabelText(label);
    expect(
      within(timeInput).getByLabelText(/hour/i).getAttribute("value")
    ).toEqual(value.hour);
    expect(
      within(timeInput)
        .getByLabelText(/minute/i)
        .getAttribute("value")
    ).toEqual(value.minute);
  }
};

export const expectValidShift = (shift: Shift) => {
  expect(typeof shift.start).toBe("string");
  expect(typeof shift.end).toBe("string");
  expect(typeof shift.breakDuration).toBe("number");
};

import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShiftValues } from "types";

export const submitLoginForm = (email: string, password: string) => {
  userEvent.type(screen.getByLabelText(/Email Address/), email);
  userEvent.type(screen.getByLabelText(/Password/), password);
  userEvent.click(screen.getByText(/Log in/));
};

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

export const enterShiftValues = (
  shiftInput: HTMLElement,
  shiftValues: ShiftValues
) => {
  for (let { label, value } of timeInputs(shiftValues)) {
    const timeInput = within(shiftInput).getByLabelText(label);
    if (value !== null) {
      if (value.hour !== null) {
        const hourInput = within(timeInput).getByLabelText(/hour/i);
        const hourValue = value.hour.toString();
        userEvent.type(hourInput, hourValue);
      }
      if (value.minute !== null) {
        const minuteInput = within(timeInput).getByLabelText(/minute/i);
        const minuteValue = value.minute.toString();
        userEvent.type(minuteInput, minuteValue);
      }
    }
  }
};

export const eraseShiftValues = (shiftInput: HTMLElement) => {
  const inputLabels = [/start/i, /end/i, /break/i];

  for (let label of inputLabels) {
    const timeInput = within(shiftInput).getByLabelText(label);
    const hourInput = within(timeInput).getByLabelText(/hour/i);
    const minuteInput = within(timeInput).getByLabelText(/minute/i);
    userEvent.clear(hourInput);
    userEvent.clear(minuteInput);
  }
};

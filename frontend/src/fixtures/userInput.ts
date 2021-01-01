import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShiftTimes } from "types";

export const submitLoginForm = (email: string, password: string) => {
  userEvent.type(screen.getByLabelText(/Email Address/), email);
  userEvent.type(screen.getByLabelText(/Password/), password);
  userEvent.click(screen.getByText(/Log in/));
};

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

export const enterShiftTimes = (
  shiftInput: HTMLElement,
  shiftTimes: ShiftTimes
) => {
  for (let { label, value } of timeInputs(shiftTimes)) {
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

export const eraseShiftTimes = (shiftInput: HTMLElement) => {
  const inputLabels = [/start time/i, /end time/i, /break duration/i];

  for (let label of inputLabels) {
    const timeInput = within(shiftInput).getByLabelText(label);
    const hourInput = within(timeInput).getByLabelText(/hour/i);
    const minuteInput = within(timeInput).getByLabelText(/minute/i);
    userEvent.clear(hourInput);
    userEvent.clear(minuteInput);
  }
};

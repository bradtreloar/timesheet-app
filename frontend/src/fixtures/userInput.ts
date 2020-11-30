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
      if (value.hours !== null) {
        const hoursInput = within(timeInput).getByLabelText(/hours/i);
        const hoursValue = value.hours.toString();
        userEvent.type(hoursInput, hoursValue);
      }
      if (value.minutes !== null) {
        const minutesInput = within(timeInput).getByLabelText(/minutes/i);
        const minutesValue = value.minutes.toString();
        userEvent.type(minutesInput, minutesValue);
      }
    }
  }
};

export const eraseShiftTimes = (shiftInput: HTMLElement) => {
  const inputLabels = [/start time/i, /end time/i, /break duration/i];

  for (let label of inputLabels) {
    const timeInput = within(shiftInput).getByLabelText(label);
    const hoursInput = within(timeInput).getByLabelText(/hours/i);
    const minutesInput = within(timeInput).getByLabelText(/minutes/i);
    userEvent.clear(hoursInput);
    userEvent.clear(minutesInput);
  }
};

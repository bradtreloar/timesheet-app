import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import randomstring from "randomstring";
import TimeInput from "./TimeInput";
import { randomInt } from "../fixtures/random";
import { SimpleTime } from "../helpers/date";
import { noop } from "lodash";

test("renders null value", () => {
  const testTime = new SimpleTime(null, null);

  render(<TimeInput value={testTime} onChange={noop} />);

  expect(screen.getByLabelText(/hours/i).getAttribute("value")).toEqual("");
  expect(screen.getByLabelText(/minutes/i).getAttribute("value")).toEqual("");
});

test("renders hours only", () => {
  const hours = randomInt(0, 23);
  const testTime = new SimpleTime(hours, null);

  render(<TimeInput value={testTime} onChange={noop} />);

  expect(screen.getByLabelText(/hours/i).getAttribute("value")).toEqual(
    hours.toString()
  );
  expect(screen.getByLabelText(/minutes/i).getAttribute("value")).toEqual("");
});

test("renders minutes only", () => {
  const minutes = randomInt(0, 9);
  const testTime = new SimpleTime(null, minutes);

  render(<TimeInput value={testTime} onChange={noop} />);

  expect(screen.getByLabelText(/hours/i).getAttribute("value")).toEqual("");
  expect(screen.getByLabelText(/minutes/i).getAttribute("value")).toEqual(
    minutes.toString().padStart(2, "0")
  );
});

test("renders hours and minutes", () => {
  const hours = randomInt(0, 23);
  const minutes = randomInt(0, 9);
  const testTime = new SimpleTime(hours, minutes);

  render(<TimeInput value={testTime} onChange={noop} />);

  expect(screen.getByLabelText(/hours/i).getAttribute("value")).toEqual(
    hours.toString()
  );
  expect(screen.getByLabelText(/minutes/i).getAttribute("value")).toEqual(
    minutes.toString().padStart(2, "0")
  );
});

test("handles hours input", () => {
  const hours = randomInt(12, 21);
  const onChange = jest.fn();

  render(<TimeInput value={new SimpleTime(null, null)} onChange={onChange} />);

  const hoursInput = screen.getByLabelText(/hours/i);
  userEvent.type(hoursInput, hours.toString());

  expect(onChange).toHaveBeenCalledTimes(2);
  for (let char of hours.toString()) {
    expect(onChange).toHaveBeenCalledWith({
      hours: parseInt(char),
      minutes: null,
    });
  }

  // The input element's value should remain blank as we aren't updating
  // its time prop.
  expect(hoursInput.getAttribute("value")).toEqual("");
});

test("handles minutes input", () => {
  const minutes = randomInt(12, 21);
  const onChange = jest.fn();

  render(<TimeInput value={new SimpleTime(null, null)} onChange={onChange} />);

  userEvent.type(screen.getByLabelText(/minutes/i), minutes.toString());

  expect(onChange).toHaveBeenCalledTimes(2);
  for (let char of minutes.toString()) {
    expect(onChange).toHaveBeenCalledWith({
      hours: null,
      minutes: parseInt(char),
    });
  }

  // The input element's value should remain blank as we aren't updating
  // its time prop.
  expect(screen.getByLabelText(/minutes/i).getAttribute("value")).toEqual("");
});

test("handles hours input with existing value", () => {
  const hours = randomInt(0, 2);
  const time = new SimpleTime(1, null);
  const onChange = jest.fn();

  render(<TimeInput value={time} onChange={onChange} />);

  const hoursInput = screen.getByLabelText(/hours/i);
  expect(hoursInput.getAttribute("value")).toEqual("1");

  userEvent.type(hoursInput, hours.toString());

  const expectedHours = hours + 10;
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({
    hours: expectedHours,
    minutes: null,
  });

  // The input element's value should remain unchanged as we aren't updating
  // its time prop.
  expect(hoursInput.getAttribute("value")).toEqual("1");
});

test("ignores invalid input", () => {
  const hours = randomInt(1, 23);
  const time = new SimpleTime(hours, null);
  const onChange = jest.fn();

  render(<TimeInput value={time} onChange={onChange} />);

  const hoursInput = screen.getByLabelText(/hours/i);
  expect(hoursInput.getAttribute("value")).toEqual(hours.toString());

  fireEvent.keyPress(hoursInput, "a");
  expect(onChange).toHaveBeenCalledTimes(0);
  expect(hoursInput.getAttribute("value")).toEqual(hours.toString());
});

test("handles erase existing hours value", () => {
  const hours = randomInt(0, 23);
  const time = new SimpleTime(hours, null);
  const onChange = jest.fn();

  render(<TimeInput value={time} onChange={onChange} />);
  const hoursInput = screen.getByLabelText(/hours/i);
  expect(hoursInput.getAttribute("value")).toEqual(hours.toString());

  userEvent.clear(hoursInput);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({
    hours: null,
    minutes: null,
  });
  expect(hoursInput.getAttribute("value")).toEqual(hours.toString());
});

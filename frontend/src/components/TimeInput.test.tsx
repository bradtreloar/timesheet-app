import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimeInput from "./TimeInput";
import { randomInt } from "../fixtures/random";
import { noop } from "lodash";

test("renders null value", () => {
  render(
    <TimeInput
      value={{
        hours: "",
        minutes: "",
      }}
      onChange={noop}
    />
  );

  expect(screen.getByLabelText(/hours/i).getAttribute("value")).toEqual("");
  expect(screen.getByLabelText(/minutes/i).getAttribute("value")).toEqual("");
});

test("renders hours only", () => {
  const hours = randomInt(0, 23).toString();

  render(
    <TimeInput
      value={{
        hours,
        minutes: "",
      }}
      onChange={noop}
    />
  );

  expect(screen.getByLabelText(/hours/i).getAttribute("value")).toEqual(hours);
  expect(screen.getByLabelText(/minutes/i).getAttribute("value")).toEqual("");
});

test("renders minutes only", () => {
  const minutes = randomInt(0, 9).toString();

  render(
    <TimeInput
      value={{
        hours: "",
        minutes,
      }}
      onChange={noop}
    />
  );

  expect(screen.getByLabelText(/hours/i).getAttribute("value")).toEqual("");
  expect(screen.getByLabelText(/minutes/i).getAttribute("value")).toEqual(
    minutes
  );
});

test("renders hours and minutes", () => {
  const hours = randomInt(0, 23).toString();
  const minutes = randomInt(0, 9).toString();

  render(
    <TimeInput
      value={{
        hours,
        minutes,
      }}
      onChange={noop}
    />
  );

  expect(screen.getByLabelText(/hours/i).getAttribute("value")).toEqual(hours);
  expect(screen.getByLabelText(/minutes/i).getAttribute("value")).toEqual(
    minutes
  );
});

test("handles hours input", () => {
  const hours = randomInt(12, 21).toString();
  let charIndex = 0;
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual(hours[charIndex]);
    charIndex++;
  };

  render(
    <TimeInput
      value={{
        hours: "",
        minutes: "",
      }}
      onChange={onChange}
    />
  );

  userEvent.type(screen.getByLabelText(/hours/i), hours);
});

test("handles minutes input", () => {
  const minutes = randomInt(12, 21).toString();
  let charIndex = 0;
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual(minutes[charIndex]);
    charIndex++;
  };

  render(
    <TimeInput
      value={{
        hours: "",
        minutes: "",
      }}
      onChange={onChange}
    />
  );

  userEvent.type(screen.getByLabelText(/minutes/i), minutes.toString());
});

test("handles hours input with existing value", () => {
  const hours = randomInt(0, 2).toString();
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual("1" + hours);
  };

  render(
    <TimeInput
      value={{
        hours: "1",
        minutes: "",
      }}
      onChange={onChange}
    />
  );

  userEvent.type(screen.getByLabelText(/hours/i), hours);
});

test("ignores invalid input", () => {
  const hours = randomInt(1, 23).toString();
  const onChange = jest.fn();

  render(
    <TimeInput
      value={{
        hours,
        minutes: "",
      }}
      onChange={onChange}
    />
  );

  const hoursInput = screen.getByLabelText(/hours/i);
  fireEvent.keyPress(hoursInput, "a");
  expect(onChange).toHaveBeenCalledTimes(0);
  expect(hoursInput.getAttribute("value")).toEqual(hours);
});

test("handles erase existing hours value", () => {
  const hours = randomInt(0, 23).toString();
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual("");
  };

  render(
    <TimeInput
      value={{
        hours,
        minutes: "",
      }}
      onChange={onChange}
    />
  );
  userEvent.clear(screen.getByLabelText(/hours/i));
});

test("handles erase existing minutes value", () => {
  const minutes = randomInt(0, 59).toString().padStart(2, "0");
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual("");
  };

  render(
    <TimeInput
      value={{
        hours: "",
        minutes,
      }}
      onChange={onChange}
    />
  );
  userEvent.clear(screen.getByLabelText(/hours/i));
});

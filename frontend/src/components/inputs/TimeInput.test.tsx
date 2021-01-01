import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimeInput from "./TimeInput";
import { randomInt } from "fixtures/random";
import { noop } from "lodash";

test("renders null value", () => {
  render(
    <TimeInput
      value={{
        hour: "",
        minute: "",
      }}
      onChange={noop}
    />
  );

  expect(screen.getByLabelText(/hour/i).getAttribute("value")).toEqual("");
  expect(screen.getByLabelText(/minute/i).getAttribute("value")).toEqual("");
});

test("renders hour only", () => {
  const hour = randomInt(0, 23).toString();

  render(
    <TimeInput
      value={{
        hour,
        minute: "",
      }}
      onChange={noop}
    />
  );

  expect(screen.getByLabelText(/hour/i).getAttribute("value")).toEqual(hour);
  expect(screen.getByLabelText(/minute/i).getAttribute("value")).toEqual("");
});

test("renders minute only", () => {
  const minute = randomInt(0, 9).toString();

  render(
    <TimeInput
      value={{
        hour: "",
        minute,
      }}
      onChange={noop}
    />
  );

  expect(screen.getByLabelText(/hour/i).getAttribute("value")).toEqual("");
  expect(screen.getByLabelText(/minute/i).getAttribute("value")).toEqual(
    minute
  );
});

test("renders hour and minute", () => {
  const hour = randomInt(0, 23).toString();
  const minute = randomInt(0, 9).toString();

  render(
    <TimeInput
      value={{
        hour,
        minute,
      }}
      onChange={noop}
    />
  );

  expect(screen.getByLabelText(/hour/i).getAttribute("value")).toEqual(hour);
  expect(screen.getByLabelText(/minute/i).getAttribute("value")).toEqual(
    minute
  );
});

test("handles hour input", () => {
  const hour = randomInt(12, 21).toString();
  let charIndex = 0;
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual(hour[charIndex]);
    charIndex++;
  };

  render(
    <TimeInput
      value={{
        hour: "",
        minute: "",
      }}
      onChange={onChange}
    />
  );

  userEvent.type(screen.getByLabelText(/hour/i), hour);
});

test("handles minute input", () => {
  const minute = randomInt(12, 21).toString();
  let charIndex = 0;
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual(minute[charIndex]);
    charIndex++;
  };

  render(
    <TimeInput
      value={{
        hour: "",
        minute: "",
      }}
      onChange={onChange}
    />
  );

  userEvent.type(screen.getByLabelText(/minute/i), minute.toString());
});

test("handles hour input with existing value", () => {
  const hour = randomInt(0, 2).toString();
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual("1" + hour);
  };

  render(
    <TimeInput
      value={{
        hour: "1",
        minute: "",
      }}
      onChange={onChange}
    />
  );

  userEvent.type(screen.getByLabelText(/hour/i), hour);
});

test("ignores invalid input", () => {
  const hour = randomInt(1, 23).toString();
  const onChange = jest.fn();

  render(
    <TimeInput
      value={{
        hour,
        minute: "",
      }}
      onChange={onChange}
    />
  );

  const hourInput = screen.getByLabelText(/hour/i);
  fireEvent.keyPress(hourInput, "a");
  expect(onChange).toHaveBeenCalledTimes(0);
  expect(hourInput.getAttribute("value")).toEqual(hour);
});

test("handles erase existing hour value", () => {
  const hour = randomInt(0, 23).toString();
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual("");
  };

  render(
    <TimeInput
      value={{
        hour,
        minute: "",
      }}
      onChange={onChange}
    />
  );
  userEvent.clear(screen.getByLabelText(/hour/i));
});

test("handles erase existing minute value", () => {
  const minute = randomInt(0, 59).toString().padStart(2, "0");
  const onChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    expect(event.target.value).toEqual("");
  };

  render(
    <TimeInput
      value={{
        hour: "",
        minute,
      }}
      onChange={onChange}
    />
  );
  userEvent.clear(screen.getByLabelText(/hour/i));
});

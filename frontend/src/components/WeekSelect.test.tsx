import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WeekSelect from "./WeekSelect";
import { longFormatDate } from "../helpers/date";

test("renders week select label", () => {
  const testDate = new Date();
  const label = longFormatDate(testDate);

  render(
    <WeekSelect
      weekStartDate={testDate}
      onChangeWeek={() => {}}
    />
  );

  screen.getByText(new RegExp(label));
});

test("handles move one week forward", (done) => {
  const testDate = new Date();

  render(
    <WeekSelect
      weekStartDate={testDate}
      onChangeWeek={(forward) => {
        expect(forward).toBe(true);
        done();
      }}
    />
  );

  userEvent.click(screen.getByLabelText(/next week/));
});


test("handles move one week backward", (done) => {
  const testDate = new Date();

  render(
    <WeekSelect
      weekStartDate={testDate}
      onChangeWeek={(forward) => {
        expect(forward).toBe(false);
        done();
      }}
    />
  );

  userEvent.click(screen.getByLabelText(/previous week/));
});

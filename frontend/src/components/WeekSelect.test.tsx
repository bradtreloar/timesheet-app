import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WeekSelect from "./WeekSelect";
import { addWeek, longFormatDate, subtractWeek } from "../helpers/date";
import { noop } from "lodash";

test("renders week select label", () => {
  const testDate = new Date();
  const label = longFormatDate(testDate);

  render(<WeekSelect value={testDate} onChange={noop} />);

  screen.getByText(new RegExp(label));
});

test("handles move one week forward", (done) => {
  const testDate = new Date();

  render(
    <WeekSelect
      value={testDate}
      onChange={(value) => {
        expect(value).toEqual(addWeek(testDate));
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
      value={testDate}
      onChange={(value) => {
        expect(value).toEqual(subtractWeek(testDate));
        done();
      }}
    />
  );

  userEvent.click(screen.getByLabelText(/previous week/));
});

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WeekSelect from "./WeekSelect";
import { noop } from "lodash";
import { DateTime } from "luxon";

const testDateTime = DateTime.local();

test("renders week select label", () => {
  const fromLabel = testDateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
  const toLabel = testDateTime.plus({ days: 6 }).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
  const label = `${fromLabel} to ${toLabel}`;

  render(<WeekSelect value={testDateTime} onChange={noop} />);

  screen.getByText(new RegExp(label));
});

test("handles move one week forward", (done) => {
  render(
    <WeekSelect
      value={testDateTime}
      onChange={(value) => {
        expect(value).toEqual(testDateTime.plus({ weeks: 1 }));
        done();
      }}
    />
  );

  userEvent.click(screen.getByLabelText(/next week/));
});

test("handles move one week backward", (done) => {
  render(
    <WeekSelect
      value={testDateTime}
      onChange={(value) => {
        expect(value).toEqual(testDateTime.minus({ weeks: 1 }));
        done();
      }}
    />
  );

  userEvent.click(screen.getByLabelText(/previous week/));
});

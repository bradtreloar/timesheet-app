import { act, render, screen } from "@testing-library/react";
import { ProvidersFixture } from "fixtures/context";
import { randomSettings, randomTimesheets, randomUser } from "fixtures/random";
import { DateTime } from "luxon";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router";
import * as datastore from "services/datastore";
import { getTimesheetTotalHours } from "services/date";
import store from "store";
import { setSettings } from "store/settings";
import { setTimesheets } from "store/timesheets";
import TimesheetIndexPage from "./TimesheetIndexPage";

jest.mock("services/datastore");
const testUser = randomUser();
const testTimesheets = randomTimesheets(testUser, 3);
const testSettings = randomSettings();

const Fixture: React.FC = () => {
  return (
    <Provider store={store}>
      <ProvidersFixture>
        <MemoryRouter>
          <Route exact path="/">
            <TimesheetIndexPage />
          </Route>
        </MemoryRouter>
      </ProvidersFixture>
    </Provider>
  );
};

beforeAll(() => {
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  localStorage.setItem("user", JSON.stringify(testUser));
  store.dispatch(setSettings(testSettings));
  store.dispatch(setTimesheets(testTimesheets));
});

test("renders timesheet index page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/timesheets/i);
  testTimesheets.forEach((timesheet) => {
    screen.getAllByText(
      DateTime.fromISO(timesheet.created as string).toLocaleString(
        DateTime.DATE_SHORT
      )
    );
    screen.getAllByText(new RegExp(getTimesheetTotalHours(timesheet)));
  });
});

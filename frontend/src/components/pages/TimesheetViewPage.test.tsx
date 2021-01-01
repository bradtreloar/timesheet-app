import React from "react";
import { act, render, screen } from "@testing-library/react";
import { ProvidersFixture } from "fixtures/context";
import { MemoryRouter, Route } from "react-router-dom";
import { randomTimesheet, randomUser } from "fixtures/random";
import TimesheetViewPage from "./TimesheetViewPage";
import * as datastore from "services/datastore";
import { Provider } from "react-redux";
import store from "store";
import { setTimesheets } from "store/timesheets";

jest.mock("services/datastore");
const testUser = randomUser();
const testTimesheet = randomTimesheet(testUser);

const Fixture: React.FC = () => {
  const timesheetID = testTimesheet.id as string;
  return (
    <Provider store={store}>
      <ProvidersFixture>
        <MemoryRouter initialEntries={[`/timesheet/${timesheetID}`]}>
          <Route path="/timesheet/:id">
            <TimesheetViewPage />
          </Route>
        </MemoryRouter>
      </ProvidersFixture>
    </Provider>
  );
};

beforeAll(() => {
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  localStorage.setItem("user", JSON.stringify(testUser));
  store.dispatch(setTimesheets([testTimesheet]));
});

test("renders timesheet view page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/timesheet/i);
});

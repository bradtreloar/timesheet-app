import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProvidersFixture } from "fixtures/context";
import { MemoryRouter, Route } from "react-router-dom";
import {
  randomSettings,
  randomTimesheet,
  randomUser,
} from "fixtures/random";
import TimesheetFormPage from "./TimesheetFormPage";
import * as datastore from "services/datastore";
import { Provider } from "react-redux";
import store from "store";
import { setSettings } from "store/settings";
import { Shift } from "types";
import { getTimesFromShift } from "services/adaptors";
import { DateTime } from "luxon";

jest.mock("services/datastore");
const testUser = randomUser();
const testTimesheet = randomTimesheet(testUser);
testTimesheet.comment = "";
const testShifts = testTimesheet.shifts as Shift[];
// Make the user's default shift times coincide with the test timesheet's times.
testUser.defaultShifts = testShifts.map((shift) => getTimesFromShift(shift));
// Make the first day of the week coincide with the date of the first shift
// in testTimesheet.
const testSettings = randomSettings({
  firstDayOfWeek: DateTime.fromISO(testShifts[0].start).weekday.toString(),
});

const Fixture: React.FC = () => {
  return (
    <Provider store={store}>
      <ProvidersFixture>
        <MemoryRouter>
          <Route exact path="/">
            <TimesheetFormPage />
          </Route>
          <Route exact path="/timesheet/confirmation">
            form submitted
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
});

test("renders timesheet page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/new timesheet/i);
});

test("handles TimesheetForm submission", async () => {
  jest.spyOn(datastore, "createTimesheet").mockResolvedValue(testTimesheet);
  jest.spyOn(datastore, "createShifts").mockResolvedValue(testShifts);
  jest.spyOn(datastore, "completeTimesheet").mockResolvedValue(testTimesheet);

  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/new timesheet/i);
  await act(async () => {
    userEvent.click(screen.getByText(/^submit$/i));
  });
  await screen.findByText(/form submitted/i);
  expect(datastore.createTimesheet).toHaveBeenCalledWith({
    userID: testTimesheet.userID,
    shifts: testTimesheet.shifts,
    comment: testTimesheet.comment,
  });
});

test("displays error when timesheet creation fails", async () => {
  const errorMessage = "unable to create timesheet";
  jest.spyOn(datastore, "createTimesheet").mockRejectedValue(new Error(errorMessage));

  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/new timesheet/i);
  await act(async () => {
    userEvent.click(screen.getByText(/^submit$/i));
  });
  await screen.findByText(errorMessage);
  expect(datastore.createTimesheet).toHaveBeenCalledWith({
    userID: testTimesheet.userID,
    shifts: testTimesheet.shifts,
    comment: testTimesheet.comment,
  });
});

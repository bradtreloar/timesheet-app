import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router-dom";
import { randomSettings, randomTimesheet, randomUser } from "fixtures/random";
import TimesheetPage from "./TimesheetPage";
import * as datastore from "services/datastore";
import { Provider } from "react-redux";
import store from "store";
import { clearSettings, setSettings } from "store/settings";
import { Shift } from "types";
import { getTimesFromShift } from "services/adaptors";
import SettingsPage from "./SettingsPage";
import { AuthProvider } from "context/auth";

jest.mock("services/datastore");
const testUser = randomUser();
const testTimesheet = randomTimesheet(testUser);
const testShifts = testTimesheet.shifts as Shift[];
// Make the user's default shift times coincide with the test timesheet's times.
testUser.defaultShifts = testShifts.map((shift) => getTimesFromShift(shift));
// Make the first day of the week coincide with the date of the first shift
// in testTimesheet.
const testSettings = randomSettings({
  firstDayOfWeek: new Date(testShifts[0].start).getDay().toString(),
});

const Fixture: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <MemoryRouter>
          <Route exact path="/">
            <SettingsPage />
          </Route>
          <Route exact path="/timesheet/confirmation">
            form submitted
          </Route>
        </MemoryRouter>
      </AuthProvider>
    </Provider>
  );
};

beforeAll(() => {
  store.dispatch(clearSettings());
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  localStorage.setItem("user", JSON.stringify(testUser));
  store.dispatch(setSettings(testSettings));
});

test("renders settings page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/settings/i);
});

test("handles SettingsForm submission", async () => {
  jest.spyOn(datastore, "updateSettings").mockResolvedValue(testSettings);
  
  await act(async () => {
    render(<Fixture />);
  });

  await act(async () => {
    userEvent.click(screen.getByText(/^save settings$/i));
  });
  expect(datastore.updateSettings).toHaveBeenCalledWith(testSettings);
});

test("displays error when settings update fails", async () => {
  const errorMessage = "unable to save settings";
  jest.spyOn(datastore, "updateSettings").mockRejectedValue(errorMessage);

  await act(async () => {
    render(<Fixture />);
  });

  await act(async () => {
    userEvent.click(screen.getByText(/^save settings$/i));
  });
  expect(datastore.updateSettings).toHaveBeenCalledWith(testSettings);
  screen.getByText(errorMessage);
});

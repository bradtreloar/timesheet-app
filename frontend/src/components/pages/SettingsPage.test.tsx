import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router-dom";
import { ProvidersFixture } from "fixtures/context";
import { randomSettings, randomTimesheet, randomUser } from "fixtures/random";
import * as datastore from "services/datastore";
import { Provider } from "react-redux";
import store from "store";
import { clearSettings, setSettings } from "store/settings";
import { Shift } from "types";
import { getTimesFromShift } from "services/adaptors";
import SettingsPage from "./SettingsPage";
import { DateTime } from "luxon";

jest.mock("services/datastore");
const testUser = randomUser();
const testTimesheet = randomTimesheet(testUser);
const testShifts = testTimesheet.shifts as Shift[];
// Make the user's default shift times coincide with the test timesheet's times.
testUser.defaultShifts = testShifts.map((shift) => getTimesFromShift(shift));
// Make the first day of the week coincide with the date of the first shift
// in testTimesheet.
const testSettings = randomSettings({
  firstDayOfWeek: DateTime.fromISO(testShifts[0].start).weekday.toString()
});

const Fixture: React.FC = () => {
  return (
    <Provider store={store}>
      <ProvidersFixture>
        <MemoryRouter>
          <Route exact path="/">
            <SettingsPage />
          </Route>
        </MemoryRouter>
      </ProvidersFixture>
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
  await screen.findByText(/settings updated/i);
});

test("displays error when settings update fails", async () => {
  const errorMessage = "unable to save settings";
  jest.spyOn(datastore, "updateSettings").mockRejectedValue(new Error(errorMessage));

  await act(async () => {
    render(<Fixture />);
  });

  await act(async () => {
    userEvent.click(screen.getByText(/^save settings$/i));
  });
  screen.getByText(errorMessage);
  expect(datastore.updateSettings).toHaveBeenCalledWith(testSettings);
});

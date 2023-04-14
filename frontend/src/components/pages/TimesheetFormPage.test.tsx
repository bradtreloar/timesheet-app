import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProvidersFixture } from "fixtures/context";
import { MemoryRouter, Route } from "react-router-dom";
import {
  randomReason,
  randomSettings,
  randomTimesheet,
  randomUser,
} from "fixtures/random";
import TimesheetFormPage from "./TimesheetFormPage";
import * as datastore from "services/datastore";
import { Provider } from "react-redux";
import store from "store";
import { setSettings } from "store/settings";
import { getTimesFromShift } from "services/adaptors";
import { DateTime } from "luxon";
import { cloneDeep } from "lodash";

jest.mock("services/datastore");

const getFixtures = () => {
  const testUser = randomUser();
  const testTimesheet = randomTimesheet(testUser);
  testTimesheet.comment = "";
  const testShifts = testTimesheet.shifts as Shift[];
  // Make the user's default shift times coincide with the test timesheet's times.
  testUser.defaultShiftValues = testShifts.map((shift) => getTimesFromShift(shift));

  return {
    testTimesheet,
    testShifts,
    testUser,
  };
}

export const EMPTY_SHIFT_TIMES = {
  isActive: false,
  reason: "rostered-day-off",
  startTime: { hour: "", minute: "" },
  endTime: { hour: "", minute: "" },
  breakDuration: { hour: "", minute: "" },
} as ShiftValues;

const Fixture: React.FC = () => {
  return (
    <Provider store={store}>
      <ProvidersFixture>
        <MemoryRouter initialEntries={["/timesheet/new"]}>
          <Route exact path="/timesheet/new">
            <TimesheetFormPage />
          </Route>
          <Route exact path="/">
            form submitted
          </Route>
        </MemoryRouter>
      </ProvidersFixture>
    </Provider>
  );
};

beforeEach(() => {
  const testSettings = randomSettings();
  store.dispatch(setSettings(testSettings));
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders timesheet page", async () => {
  const { testUser } = getFixtures();
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/new timesheet/i);
});

test("handles timesheet submission", async () => {
  const { testShifts, testTimesheet, testUser } = getFixtures();
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  jest.spyOn(datastore, "createTimesheet").mockResolvedValue(testTimesheet);
  jest.spyOn(datastore, "createShifts").mockResolvedValue(testShifts);
  jest.spyOn(datastore, "completeTimesheet").mockResolvedValue(testTimesheet);

  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/new timesheet/i);
  await act(async () => {
    userEvent.click(screen.getByText(/^submit/i));
  });
  await screen.findByText(/form submitted/i);
  expect(datastore.createTimesheet).toHaveBeenCalledWith({
    userID: testTimesheet.userID,
    absences: [],
    shifts: testTimesheet.shifts,
    comment: testTimesheet.comment,
  });
});

test("displays error when timesheet creation fails", async () => {
  const { testTimesheet, testUser } = getFixtures();
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);

  const errorMessage = "unable to create timesheet";
  jest
    .spyOn(datastore, "createTimesheet")
    .mockRejectedValue(new Error(errorMessage));

  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/new timesheet/i);
  await act(async () => {
    userEvent.click(screen.getByText(/^submit/i));
  });
  await screen.findByText(errorMessage);
  expect(datastore.createTimesheet).toHaveBeenCalledWith({
    userID: testTimesheet.userID,
    absences: [],
    shifts: testTimesheet.shifts,
    comment: testTimesheet.comment,
  });
});

test("updates the user's default shifts and shows a confirmation message", async () => {
  const { testUser } = getFixtures();
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);

  const expectedTestUser = cloneDeep(testUser);
  expectedTestUser.defaultShiftValues[0] = EMPTY_SHIFT_TIMES;
  jest.spyOn(datastore, "updateUser").mockResolvedValue(expectedTestUser);

  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/new timesheet/i);
  userEvent.click(screen.getByTestId("shift-0-toggle"));
  userEvent.selectOptions(screen.getByTestId("shift-0-reason"), "rostered-day-off");
  await act(async () => {
    userEvent.click(screen.getByText(/save these shifts as my default/i));
  });
  await screen.findByText(/your default shifts have been updated/i);
  expect(datastore.updateUser).toHaveBeenCalledWith(expectedTestUser);
});

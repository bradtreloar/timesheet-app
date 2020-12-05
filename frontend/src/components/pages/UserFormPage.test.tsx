import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "context/auth";
import { MessagesProvider } from "context/messages";
import {
  randomSettings,
  randomTimesheets,
  randomUser,
  randomUsers,
} from "fixtures/random";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router";
import * as datastore from "services/datastore";
import { formattedDate, getTimesheetTotalHours } from "services/date";
import store from "store";
import { setSettings } from "store/settings";
import { setTimesheets } from "store/timesheets";
import { clearUsers, setUsers } from "store/users";
import UserFormPage from "./UserFormPage";
import UserIndexPage from "./UserIndexPage";

jest.mock("services/datastore");
const testUser = randomUser();
const testNewUser = randomUser();
const testUsers = randomUsers(3);

const Fixture: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <MessagesProvider>
          <MemoryRouter>
            <UserFormPage />
          </MemoryRouter>
        </MessagesProvider>
      </AuthProvider>
    </Provider>
  );
};

beforeAll(() => {
  store.dispatch(clearUsers);
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  localStorage.setItem("user", JSON.stringify(testUser));
});

describe("new user form", () => {
  beforeEach(() => {
    jest.spyOn(datastore, "createUser").mockResolvedValue(testNewUser);
  });

  test("renders", async () => {
    await act(async () => {
      render(<Fixture />);
    });

    expect(screen.getByRole("heading")).toHaveTextContent(/new user/i);
    screen.getByLabelText(/name/i);
    screen.getByLabelText(/email/i);
    screen.getByLabelText(/administrator/i);
  });

  test("handles form submit", async () => {
    await act(async () => {
      render(<Fixture />);
    });

    expect(screen.getByRole("heading")).toHaveTextContent(/new user/i);
    userEvent.type(screen.getByLabelText(/name/i), testNewUser.name);
    userEvent.type(screen.getByLabelText(/email/i), testNewUser.email);
    await act(async () => {
      userEvent.click(screen.getByText(/create user/i));
    });

    const { users } = store.getState().users;
    expect(users).toStrictEqual([testNewUser]);
  });
});

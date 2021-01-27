import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProvidersFixture } from "fixtures/context";
import {
  randomSettings,
  randomTimesheets,
  randomUser,
  randomUsers,
} from "fixtures/random";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router";
import faker from "faker";
import * as datastore from "services/datastore";
import store from "store";
import { clearUsers, setUsers } from "store/users";
import AccountPage from "./AccountPage";

jest.mock("services/datastore");
const testUser = randomUser();
const testNewUser = randomUser();
const testUpdatedUser = Object.assign({}, testUser, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  phoneNumber: faker.phone.phoneNumber("04## ### ###"),
});

const Fixture: React.FC<{
  initialEntries?: string[];
}> = ({ initialEntries }) => {
  return (
    <Provider store={store}>
      <ProvidersFixture>
        <MemoryRouter initialEntries={initialEntries}>
          <AccountPage />
        </MemoryRouter>
      </ProvidersFixture>
    </Provider>
  );
};

beforeAll(() => {
  store.dispatch(clearUsers);
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  localStorage.setItem("user", JSON.stringify(testUser));
  store.dispatch(setUsers([testUser]));
  jest.spyOn(datastore, "updateUser").mockResolvedValue(testUpdatedUser);
});

test("renders", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/account settings/i);
  screen.getByLabelText(/name/i);
  screen.getByLabelText(/email/i);
  screen.getByLabelText(/phone number/i);
  screen.getByLabelText(/receive sms reminders/i);
});

test("handles form submit", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/account settings/i);
  userEvent.clear(screen.getByLabelText(/name/i));
  userEvent.type(screen.getByLabelText(/name/i), testUpdatedUser.name);
  userEvent.clear(screen.getByLabelText(/email/i));
  userEvent.type(screen.getByLabelText(/email/i), testUpdatedUser.email);
  await act(async () => {
    userEvent.click(screen.getByText(/save/i));
  });

  const { users } = store.getState().users;
  expect(users).toStrictEqual([testUpdatedUser]);
});

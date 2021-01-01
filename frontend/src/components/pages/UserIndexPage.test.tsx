import { act, render, screen } from "@testing-library/react";
import { ProvidersFixture } from "fixtures/context";
import { randomSettings, randomTimesheets, randomUser, randomUsers } from "fixtures/random";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router";
import * as datastore from "services/datastore";
import store from "store";
import { setSettings } from "store/settings";
import { setTimesheets } from "store/timesheets";
import { setUsers } from "store/users";
import UserIndexPage from "./UserIndexPage";

jest.mock("services/datastore");
const testUser = randomUser();
const testUsers = randomUsers(3);

const Fixture: React.FC = () => {
  return (
    <Provider store={store}>
      <ProvidersFixture>
        <MemoryRouter>
          <UserIndexPage />
        </MemoryRouter>
      </ProvidersFixture>
    </Provider>
  );
};

beforeAll(() => {
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  localStorage.setItem("user", JSON.stringify(testUser));
  store.dispatch(setUsers(testUsers));
});

test("renders user index page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/manage users/i);
  testUsers.forEach((user) => {
    screen.getByText(user.name);
    screen.getByText(user.email);
  });
});

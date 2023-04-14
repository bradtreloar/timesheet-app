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
import UserFormPage from "./UserFormPage";
import UserDeletePage from "./UserDeletePage";

jest.mock("services/datastore");
const testUser = randomUser();

const Fixture: React.FC<{
  initialEntries?: string[];
}> = ({ children, initialEntries }) => {
  return (
    <Provider store={store}>
      <ProvidersFixture>
        <MemoryRouter initialEntries={initialEntries}>
          <Route path="/user/:id/delete">
            <UserDeletePage />
          </Route>
        </MemoryRouter>
      </ProvidersFixture>
    </Provider>
  );
};

beforeAll(() => {
  store.dispatch(clearUsers);
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(testUser);
  jest.spyOn(datastore, "deleteUser").mockResolvedValue(testUser);
  store.dispatch(setUsers([testUser]));
});

test("renders", async () => {
  await act(async () => {
    render(<Fixture initialEntries={[`/user/${testUser.id}/delete`]} />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/delete user/i);
});

test("handles clicking delete button", async () => {
  await act(async () => {
    render(<Fixture initialEntries={[`/user/${testUser.id}/delete`]} />);
  });

  await act(async () => {
    screen.getAllByText(/delete user/i).forEach((element) => {
      if (element.getAttribute("type") === "button") {
        userEvent.click(element);
      }
    });
  });

  const { users } = store.getState().users;
  expect(users).toStrictEqual([]);
});

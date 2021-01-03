import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import randomstring from "randomstring";
import { ProvidersFixture } from "fixtures/context";
import { MemoryRouter, Route } from "react-router-dom";
import { randomPassword, randomUser } from "fixtures/random";
import PasswordResetPage from "./PasswordResetPage";
import * as datastore from "services/datastore";

jest.mock("services/datastore");
const testPassword = randomPassword();
const testUser = randomUser();
const testToken = randomstring.generate(30);

const Fixture: React.FC = () => {
  return (
    <ProvidersFixture>
      <MemoryRouter initialEntries={[`/reset-password/${testUser.email}/${testToken}`]}>
        <Route path="/reset-password/:email/:token">
          <PasswordResetPage />
        </Route>
        <Route path="/login">
          <p>Log in</p>
        </Route>
      </MemoryRouter>
    </ProvidersFixture>
  );
};

beforeEach(() => {
  jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(null);
});

test("renders password page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/set new password/i);
  screen.getByLabelText(/^new password/i);
  screen.getByLabelText(/re-enter new password/i);
});

test("handles PasswordForm submission", async () => {
  jest.spyOn(datastore, "resetPassword").mockResolvedValue();

  await act(async () => {
    render(<Fixture />);
  });

  userEvent.type(screen.getByLabelText(/^new password/i), testPassword);
  userEvent.type(screen.getByLabelText(/re-enter new password/i), testPassword);
  await act(async () => {
    userEvent.click(screen.getByTestId("password-form-submit"));
  });
  expect(datastore.resetPassword).toHaveBeenCalledWith(testUser.email, testToken, testPassword);
});

test("displays error when password update fails", async () => {
  jest
    .spyOn(datastore, "resetPassword")
    .mockRejectedValue(new Error("unable to reset password"));

  await act(async () => {
    render(<Fixture />);
  });

  userEvent.type(screen.getByLabelText(/^new password/i), testPassword);
  userEvent.type(screen.getByLabelText(/re-enter new password/i), testPassword);
  await act(async () => {
    userEvent.click(screen.getByTestId("password-form-submit"));
  });
  screen.getByText(/unable to reset password/i);
});

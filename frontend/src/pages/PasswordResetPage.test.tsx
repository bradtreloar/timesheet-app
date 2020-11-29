import React from "react";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../context/auth";
import { MemoryRouter } from "react-router-dom";
import { randomPassword, randomUser } from "../fixtures/random";
import PasswordResetPage from "./PasswordResetPage";
import * as datastore from "../services/datastore";

jest.mock("../services/datastore");
jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(null);
const testUser = randomUser();
const testPassword = randomPassword();

const Fixture: React.FC = () => {
  return (
    <AuthProvider>
      <MemoryRouter>
        <PasswordResetPage />
      </MemoryRouter>
    </AuthProvider>
  );
};

test("renders password reset page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/reset password/i);
  screen.getByLabelText(/email Address/i);
});

test("handles PasswordResetForm submission", async () => {
  jest.spyOn(datastore, "resetPassword").mockResolvedValue();

  await act(async () => {
    render(<Fixture />);
  });

  userEvent.type(screen.getByLabelText(/email Address/i), testUser.email);
  await act(async () => {
    userEvent.click(screen.getByTestId("password-reset-form-submit"));
  });
  expect(datastore.resetPassword).toHaveBeenCalledWith(testUser.email);
});

test("displays error when login fails", async () => {
  jest.spyOn(datastore, "resetPassword").mockRejectedValue(new Error("unable to reset password"));

  await act(async () => {
    render(<Fixture />);
  });

  userEvent.type(screen.getByLabelText(/email Address/i), testUser.email);
  await act(async () => {
    userEvent.click(screen.getByTestId("password-reset-form-submit"));
  });
  screen.getByText(/unable to reset password/i);
});

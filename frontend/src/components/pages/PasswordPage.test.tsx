import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProvidersFixture } from "fixtures/context";
import { MemoryRouter } from "react-router-dom";
import { randomPassword } from "fixtures/random";
import PasswordPage from "./PasswordPage";
import * as datastore from "services/datastore";

jest.mock("services/datastore");
jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(null);
const testPassword = randomPassword();

const Fixture: React.FC = () => {
  return (
    <ProvidersFixture>
      <MemoryRouter>
        <PasswordPage />
      </MemoryRouter>
    </ProvidersFixture>
  );
};

test("renders password page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/set new password/i);
  screen.getByLabelText(/^new password/i);
  screen.getByLabelText(/re-enter new password/i);
});

test("handles ForgotPasswordForm submission", async () => {
  jest.spyOn(datastore, "setPassword").mockResolvedValue();

  await act(async () => {
    render(<Fixture />);
  });

  userEvent.type(screen.getByLabelText(/^new password/i), testPassword);
  userEvent.type(screen.getByLabelText(/re-enter new password/i), testPassword);
  await act(async () => {
    userEvent.click(screen.getByTestId("password-form-submit"));
  });
  expect(datastore.setPassword).toHaveBeenCalledWith(testPassword);
});

test("displays error when login fails", async () => {
  jest
    .spyOn(datastore, "setPassword")
    .mockRejectedValue(new Error("unable to set password"));

  await act(async () => {
    render(<Fixture />);
  });

  userEvent.type(screen.getByLabelText(/^new password/i), testPassword);
  userEvent.type(screen.getByLabelText(/re-enter new password/i), testPassword);
  await act(async () => {
    userEvent.click(screen.getByTestId("password-form-submit"));
  });
  screen.getByText(/unable to set password/i);
});

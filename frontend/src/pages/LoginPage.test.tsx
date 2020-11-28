import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../context/auth";
import { MemoryRouter } from "react-router-dom";
import { randomPassword, randomUser } from "../fixtures/random";
import LoginPage from "./LoginPage";
import * as datastore from "../services/datastore";

jest.mock("../services/datastore");
jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(null);
const testUser = randomUser();
const testPassword = randomPassword();

const Fixture: React.FC = () => {
  return (
    <AuthProvider>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>
  );
};

test("renders login page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/log in/i);
  screen.getByLabelText(/email Address/i);
  screen.getByLabelText(/password/i);
});

test("handles LoginForm submission", async () => {
  jest.spyOn(datastore, "login").mockResolvedValue(testUser);

  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/Log in/i);
  userEvent.type(screen.getByLabelText(/Email Address/), testUser.email);
  userEvent.type(screen.getByLabelText(/Password/), testPassword);
  await act(async () => {
    userEvent.click(screen.getByTestId("login-form-submit"));
  });

  expect(datastore.login).toHaveBeenCalled();
});

test("receives error when login fails", async () => {
  jest.spyOn(datastore, "login").mockRejectedValue("login failed");

  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/Log in/i);
  userEvent.type(screen.getByLabelText(/Email Address/), testUser.email);
  userEvent.type(screen.getByLabelText(/Password/), testPassword);
  await act(async () => {
    userEvent.click(screen.getByTestId("login-form-submit"));
  });
  expect(screen.getByRole("heading")).toHaveTextContent(/Log in/i);
  screen.getByText("login failed");
});

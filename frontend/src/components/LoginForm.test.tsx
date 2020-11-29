import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import { randomPassword, randomUser } from "../fixtures/random";

test("Form submission succeeds", (done) => {
  const mockEmail = randomUser().email;
  const mockPassword = randomPassword();

  render(
    <LoginForm
      onSubmit={async ({ email, password }) => {
        expect(email).toBe(mockEmail);
        expect(password).toBe(mockPassword);
        done();
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/email Address/i), mockEmail);
  userEvent.type(screen.getByLabelText(/password/i), mockPassword);
  userEvent.click(screen.getByText(/log in/i));
});

test("Incomplete form submission fails", () => {
  const testUser = randomUser();

  render(
    <LoginForm
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.click(screen.getByText(/log in/i));
  expect(screen.getAllByText(/required/i)).toHaveLength(2);
  userEvent.type(screen.getByLabelText(/email Address/i), testUser.email);
  userEvent.click(screen.getByText(/log in/i));
  expect(screen.getAllByText(/required/i)).toHaveLength(1);
});

test("Invalid email address detected", () => {
  const mockUser = randomUser();
  const mockPassword = randomPassword();
  // Remove the "@"" symbol from the email to make it invalid.
  const mockEmail = mockUser.email.replace("@", "_");

  render(
    <LoginForm
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/email address/i), mockEmail);
  userEvent.type(screen.getByLabelText(/password/i), mockPassword);
  screen.getByText(/must be a valid email address/i);
  userEvent.click(screen.getByText(/log in/i));
});

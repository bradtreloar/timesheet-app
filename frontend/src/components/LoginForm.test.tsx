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
      onSubmit={async (email, password) => {
        expect(email).toBe(mockEmail);
        expect(password).toBe(mockPassword);
        done();
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/Email Address/), mockEmail);
  userEvent.type(screen.getByLabelText(/Password/), mockPassword);
  userEvent.click(screen.getByText(/Log in/));
});

test("Empty form submission fails", () => {
  render(
    <LoginForm
      onSubmit={(email, password) => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.click(screen.getByText(/Log in/i));
  expect(screen.getAllByText(/required/i)).toHaveLength(2);
});

test("Invalid email address detected", () => {
  const mockUser = randomUser();
  const mockPassword = randomPassword();
  // Remove the "@"" symbol from the email to make it invalid.
  const mockEmail = mockUser.email.replace("@", "_");

  render(
    <LoginForm
      onSubmit={(email, password) => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/Email Address/), mockEmail);
  userEvent.type(screen.getByLabelText(/Password/), mockPassword);
  userEvent.click(screen.getByText(/Log in/));
  screen.getByText(/must be a valid email address/i);
});

test("Form handles pending authentication", () => {
  render(<LoginForm onSubmit={async (email, password) => {}} pending />);

  userEvent.click(screen.getByText(/Logging in/));
});

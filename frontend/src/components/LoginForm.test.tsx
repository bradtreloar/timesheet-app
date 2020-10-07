import React from "react";
import { render, act } from "@testing-library/react";
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
        throw "onSubmit should not be called.";
      }}
    />
  );

  userEvent.click(screen.getByText(/Log in/i));
  screen.getByText(/Email address is required/i);
  screen.getByText(/Password is required/i);
});

test("Invalid email address detected", () => {
  const mockUser = randomUser();
  const mockPassword = randomPassword();
  // Remove the "@"" symbol from the email to make it invalid.
  const mockEmail = mockUser.email.replace("@", "_");

  render(
    <LoginForm
      onSubmit={(email, password) => {
        throw "onSubmit should not be called.";
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/Email Address/), mockEmail);
  userEvent.type(screen.getByLabelText(/Password/), mockPassword);
  userEvent.click(screen.getByText(/Log in/));
  screen.getByText(/Email address is not valid/i);
});

test("Form handles pending authentication", () => {
  render(<LoginForm onSubmit={async (email, password) => {}} pending />);

  userEvent.click(screen.getByText(/Logging in/));
});

test("Form displays authentication error", () => {
  render(
    <LoginForm onSubmit={async (email, password) => {}} error="Login failed." />
  );

  userEvent.click(screen.getByText(/Login failed/));
});

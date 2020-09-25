import React from "react";
import { render, act } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import { User } from "../types";
import { getMockPassword, getMockUser } from "../fixtures/mocks";

test("Form submission succeeds", (done) => {
  const mockEmail = getMockUser().email;
  const mockPassword = getMockPassword();

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
  const mockUser = getMockUser();
  const mockPassword = getMockPassword();
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

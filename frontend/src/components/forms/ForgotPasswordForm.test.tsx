import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { randomUser } from "fixtures/random";
import { noop } from "lodash";

const testEmail = randomUser().email;

test("Form renders", () => {
  render(<ForgotPasswordForm onSubmit={noop} />);
});

test("Form submission succeeds", (done) => {
  render(
    <ForgotPasswordForm
      onSubmit={({ email }) => {
        expect(email).toBe(testEmail);
        done();
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/your email address/i), testEmail);
  userEvent.click(screen.getByText(/reset password/i));
});

test("Empty form submission fails", async () => {
  render(
    <ForgotPasswordForm
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.click(screen.getByText(/reset password/i));
  screen.getByText(/required/i);
});

test("Reject invalid form input", () => {
  const invalidEmail = testEmail.replace("@", "_");

  render(
    <ForgotPasswordForm
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/your email address/i), invalidEmail);
  userEvent.click(screen.getByText(/reset password/i));
  screen.getByText(/must be a valid email address/i);
});

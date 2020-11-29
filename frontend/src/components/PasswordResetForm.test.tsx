import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import PasswordResetForm from "./PasswordResetForm";
import { randomUser } from "../fixtures/random";
import { noop } from "lodash";
import { act } from "react-dom/test-utils";

const testEmail = randomUser().email;

test("Form renders", () => {
  render(<PasswordResetForm onSubmit={noop} />);
});

test("Form submission succeeds", (done) => {
  render(
    <PasswordResetForm
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
    <PasswordResetForm
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
    <PasswordResetForm
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/your email address/i), invalidEmail);
  userEvent.click(screen.getByText(/reset password/i));
  screen.getByText(/must be a valid email address/i);
});

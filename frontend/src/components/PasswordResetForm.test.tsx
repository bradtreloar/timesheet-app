import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import PasswordResetForm from "./PasswordResetForm";
import { randomUser } from "../fixtures/random";
import { noop } from "lodash";

const testEmail = randomUser().email;

test("Form renders", () => {
  render(<PasswordResetForm onSubmit={noop} />);
});

test("Form submission succeeds", (done) => {
  render(
    <PasswordResetForm
      onSubmit={(email) => {
        expect(email).toBe(testEmail);
        done();
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/your email address/i), testEmail);
  userEvent.click(screen.getByText(/send email/i));
});

test("Empty form submission fails", () => {
  render(
    <PasswordResetForm
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.click(screen.getByText(/send email/i));
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
  userEvent.click(screen.getByText(/send email/i));
  screen.getByText(/must be a valid email address/i);
});

test("Form handles pending authentication", () => {
  render(
    <PasswordResetForm
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
      pending
    />
  );

  userEvent.click(screen.getByText(/sending email/i));
});

import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import PasswordForm from "./PasswordForm";
import { randomPassword } from "../fixtures/random";
import { noop } from "lodash";

test("Form renders", () => {
  render(<PasswordForm onSubmit={noop} />);
});

test("Form submission succeeds", (done) => {
  const mockPassword = randomPassword();

  render(
    <PasswordForm
      onSubmit={async (password) => {
        expect(password).toBe(mockPassword);
        done();
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/^new password/i), mockPassword);
  userEvent.type(screen.getByLabelText(/re-enter new password/i), mockPassword);
  userEvent.click(screen.getByText(/save password/i));
});

test("Empty form submission fails", () => {
  render(
    <PasswordForm
      onSubmit={(password) => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.click(screen.getByText(/save password/i));
  expect(screen.getAllByText(/required/i)).toHaveLength(2);
});

test("Reject invalid form input", () => {
  const mockPassword = randomPassword();

  render(
    <PasswordForm
      onSubmit={(password) => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.type(screen.getByLabelText(/^new password/i), mockPassword);
  userEvent.click(screen.getByText(/save password/i));
  screen.getByText(/required/i);
});

test("Form handles pending authentication", () => {
  render(<PasswordForm onSubmit={noop} pending />);

  userEvent.click(screen.getByText(/saving/i));
});

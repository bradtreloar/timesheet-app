import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import PasswordResetForm from "./PasswordResetForm";
import { randomPassword, randomUser } from "../fixtures/random";
import { noop } from "lodash";

test("Form submission succeeds", (done) => {
  const mockPassword = randomPassword();

  render(
    <PasswordResetForm
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
    <PasswordResetForm
      onSubmit={(password) => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.click(screen.getByText(/save password/i));
  expect(screen.getAllByText(/required/i)).toHaveLength(2);
});

test("Reject invalid form input", () => {
  const mockUser = randomUser();
  const mockPassword = randomPassword();

  render(
    <PasswordResetForm
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
  render(<PasswordResetForm onSubmit={noop} pending />);

  userEvent.click(screen.getByText(/saving/i));
});

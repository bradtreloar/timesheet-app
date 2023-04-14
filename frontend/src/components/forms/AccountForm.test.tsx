import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import AccountForm from "./AccountForm";
import { randomUser } from "fixtures/random";
import { noop } from "lodash";

const {
  name: testName,
  email: testEmail,
  phoneNumber: testPhoneNumber,
  acceptsReminders: testAcceptsReminders,
} = randomUser();
const testDefaultValues = {
  name: testName,
  email: testEmail,
  phoneNumber: testPhoneNumber,
  acceptsReminders: testAcceptsReminders,
};

test("Form renders", () => {
  render(<AccountForm defaultValues={testDefaultValues} onSubmit={noop} />);
});

test("Form submission succeeds", (done) => {
  render(
    <AccountForm
      defaultValues={testDefaultValues}
      onSubmit={({ name, email, phoneNumber, acceptsReminders }) => {
        expect(name).toEqual(testName);
        expect(email).toEqual(testEmail);
        expect(phoneNumber).toEqual(testPhoneNumber);
        expect(acceptsReminders).toEqual(testAcceptsReminders);
        done();
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/name/i));
  userEvent.type(screen.getByLabelText(/name/i), testName);
  userEvent.clear(screen.getByLabelText(/email address/i));
  userEvent.type(screen.getByLabelText(/email address/i), testEmail);
  userEvent.clear(screen.getByLabelText(/phone number/i));
  userEvent.type(screen.getByLabelText(/phone number/i), testPhoneNumber);
  userEvent.click(screen.getByText(/save/i));
});

test("Empty form submission fails", () => {
  render(
    <AccountForm
      defaultValues={testDefaultValues}
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/email address/i));
  userEvent.clear(screen.getByLabelText(/name/i));
  userEvent.clear(screen.getByLabelText(/phone number/i));
  userEvent.click(screen.getByText(/save/i));
  expect(screen.getAllByText(/required/i)).toHaveLength(3);
});

test("Reject invalid email input", () => {
  const invalidEmail = testEmail.replace("@", "_");

  render(
    <AccountForm
      defaultValues={testDefaultValues}
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/email address/i));
  userEvent.type(screen.getByLabelText(/email address/i), invalidEmail);
  userEvent.click(screen.getByText(/save/i));
  screen.getByText(/must be a valid email address/i);
});

test("Reject invalid Australian phone number input", () => {
  const invalidPhoneNumber = "grault";

  render(
    <AccountForm
      defaultValues={testDefaultValues}
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/phone number/i));
  userEvent.type(screen.getByLabelText(/phone number/i), invalidPhoneNumber);
  userEvent.click(screen.getByText(/save/i));
  screen.getByText(/must be a valid australian mobile number/i);
});

test("Disable form controls in pending state", () => {
  render(
    <AccountForm pending defaultValues={testDefaultValues} onSubmit={noop} />
  );

  screen.getByText(/saving/i);
});

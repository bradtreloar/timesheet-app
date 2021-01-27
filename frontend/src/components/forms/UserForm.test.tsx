import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import UserForm from "./UserForm";
import { randomUser } from "fixtures/random";
import { noop } from "lodash";

const testUser = randomUser();
const {
  name: testName,
  email: testEmail,
  phoneNumber: testPhoneNumber,
  acceptsReminders: testAcceptsReminders,
} = testUser;
const testDefaultValues = {
  name: testName,
  email: testEmail,
  phoneNumber: testPhoneNumber,
  acceptsReminders: testAcceptsReminders,
  isAdmin: false,
};

test("Form renders", () => {
  render(<UserForm defaultValues={testDefaultValues} onSubmit={noop} />);
});

describe("New User", () => {
  test("Form submission succeeds", (done) => {
    render(
      <UserForm
        defaultValues={null}
        onSubmit={({ name, email, phoneNumber, acceptsReminders, isAdmin }) => {
          expect(name).toEqual(testName);
          expect(email).toEqual(testEmail);
          expect(phoneNumber).toEqual(testPhoneNumber);
          expect(acceptsReminders).toEqual(testAcceptsReminders);
          expect(isAdmin).toEqual(false);
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
    if (testAcceptsReminders) {
      userEvent.click(screen.getByLabelText(/accepts sms reminders/i));
    }
    userEvent.click(screen.getByText(/create/i));
  });

  test("Form submission succeeds for admin user", (done) => {
    render(
      <UserForm
        defaultValues={null}
        onSubmit={({ name, email, phoneNumber, acceptsReminders, isAdmin }) => {
          expect(name).toEqual(testName);
          expect(email).toEqual(testEmail);
          expect(isAdmin).toEqual(true);
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
    if (testAcceptsReminders) {
      userEvent.click(screen.getByLabelText(/accepts sms reminders/i));
    }
    userEvent.click(screen.getByLabelText(/administrator/i));
    userEvent.click(screen.getByText(/create/i));
  });

  test("Disable form controls in pending state", () => {
    render(<UserForm pending defaultValues={null} onSubmit={noop} />);

    screen.getByText(/creating/i);
  });
});

describe("Existing User", () => {
  test("Form submission succeeds", (done) => {
    render(
      <UserForm
        defaultValues={testDefaultValues}
        onSubmit={({ name, email, phoneNumber, acceptsReminders, isAdmin }) => {
          expect(name).toEqual(testName);
          expect(email).toEqual(testEmail);
          expect(phoneNumber).toEqual(testPhoneNumber);
          expect(acceptsReminders).toEqual(testAcceptsReminders);
          expect(isAdmin).toEqual(false);
          done();
        }}
      />
    );

    userEvent.click(screen.getByText(/save/i));
  });

  test("Empty form submission fails", () => {
    render(
      <UserForm
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

  test("Reject invalid form input", () => {
    const invalidEmail = testEmail.replace("@", "_");

    render(
      <UserForm
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

  test("Disable form controls in pending state", () => {
    render(
      <UserForm pending defaultValues={testDefaultValues} onSubmit={noop} />
    );

    screen.getByText(/saving/i);
  });
});

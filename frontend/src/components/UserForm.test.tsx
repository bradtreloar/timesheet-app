import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import UserForm from "./UserForm";
import { randomPassword, randomUser } from "../fixtures/random";
import { noop } from "lodash";
import { User } from "../types";

const testUser = randomUser();
const { name: testName, email: testEmail } = randomUser();

test("Form renders", () => {
  render(<UserForm user={testUser} onSubmit={noop} />);
});

test("Form submission succeeds", (done) => {
  render(
    <UserForm
      user={testUser}
      onSubmit={(user) => {
        expect(user.email).toEqual(testEmail);
        expect(user.name).toEqual(testName);
        done();
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/your name/i));
  userEvent.type(screen.getByLabelText(/your name/i), testName);
  userEvent.clear(screen.getByLabelText(/your email address/i));
  userEvent.type(screen.getByLabelText(/your email address/i), testEmail);
  userEvent.click(screen.getByText(/save/i));
});

test("Empty form submission fails", () => {
  render(
    <UserForm
      user={testUser}
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/your email address/i));
  userEvent.clear(screen.getByLabelText(/your name/i));
  userEvent.click(screen.getByText(/save/i));
  expect(screen.getAllByText(/required/i)).toHaveLength(2);
});

test("Reject invalid form input", () => {
  const invalidEmail = testEmail.replace("@", "_");

  render(
    <UserForm
      user={testUser}
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
    />
  );

  userEvent.clear(screen.getByLabelText(/your email address/i));
  userEvent.type(screen.getByLabelText(/your email address/i), invalidEmail);
  userEvent.click(screen.getByText(/save/i));
  screen.getByText(/must be a valid email address/i);
});

test("Form handles pending authentication", () => {
  render(
    <UserForm
      user={testUser}
      onSubmit={() => {
        throw new Error("onSubmit should not be called.");
      }}
      pending
    />
  );

  userEvent.click(screen.getByText(/saving/i));
});

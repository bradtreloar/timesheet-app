import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { randomSettingsObject } from "fixtures/random";
import SettingsForm from "./SettingsForm";
import faker from "faker";
import { noop } from "lodash";

const testSettings = randomSettingsObject();

test("form renders", () => {
  render(<SettingsForm defaultValues={testSettings} onSubmit={noop} />);
  expect(
    screen.getByLabelText(/timesheet recipients/i).getAttribute("value")
  ).toEqual(testSettings.timesheetRecipients);
  expect(
    screen.getByLabelText(/start of week/i).getAttribute("data-value")
  ).toEqual(testSettings.firstDayOfWeek.toString());
});

describe("handles inputs", () => {
  test("timesheet recipients", () => {
    const testEmail = faker.internet.email();
    render(<SettingsForm defaultValues={testSettings} onSubmit={noop} />);
    const timesheetRecipientsInput = screen.getByLabelText(
      /timesheet recipients/i
    );
    userEvent.clear(timesheetRecipientsInput);
    userEvent.type(timesheetRecipientsInput, testEmail);
    expect(timesheetRecipientsInput.getAttribute("value")).toEqual(testEmail);
  });

  test("start of week", () => {
    const firstDayOfWeek = parseInt(testSettings.firstDayOfWeek);
    const testfirstDayOfWeek = firstDayOfWeek > 0 ? firstDayOfWeek - 1 : 6;
    render(<SettingsForm defaultValues={testSettings} onSubmit={noop} />);
    const firstDayOfWeekSelect = screen.getByLabelText(/start of week/i);
    fireEvent.change(firstDayOfWeekSelect, {
      target: {
        value: testfirstDayOfWeek.toString(),
      },
    });
    expect(
      screen.getByLabelText(/start of week/i).getAttribute("data-value")
    ).toEqual(testfirstDayOfWeek.toString());
  });
});

test("handles form submission", (done) => {
  render(
    <SettingsForm
      defaultValues={testSettings}
      onSubmit={() => {
        done();
      }}
    />
  );
  userEvent.click(screen.getByText(/save settings/i));
});

describe("validates inputs", () => {
  test("missing timesheet recipients", () => {
    const testSettings = randomSettingsObject();
    testSettings.timesheetRecipients = "";
    render(
      <SettingsForm
        defaultValues={testSettings}
        onSubmit={() => {
          throw new Error(`onSubmit should not be called with invalid value.`);
        }}
      />
    );
    userEvent.click(screen.getByText(/save settings/i));
  });
});

test("Disable form controls in pending state", () => {
  render(
    <SettingsForm pending defaultValues={testSettings} onSubmit={noop} />
  );

  screen.getByText(/saving settings/i);
});
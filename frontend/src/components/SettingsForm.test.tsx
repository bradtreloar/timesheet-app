import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { randomSettings } from "../fixtures/random";
import SettingsForm from "./SettingsForm";
import faker from "faker";
import { noop } from "lodash";

test("form renders", () => {
  const testSettings = randomSettings();
  render(<SettingsForm defaultValues={testSettings} onSubmit={noop} />);
  expect(
    screen.getByLabelText(/timesheet recipients/i).getAttribute("value")
  ).toEqual(testSettings.timesheetRecipients);
  expect(
    screen.getByLabelText(/start of week/i).getAttribute("data-value")
  ).toEqual(testSettings.startOfWeek.toString());
});

describe("handles inputs", () => {
  test("timesheet recipients", () => {
    const testSettings = randomSettings();
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
    const testSettings = randomSettings();
    const testStartOfWeek =
      testSettings.startOfWeek > 0 ? testSettings.startOfWeek - 1 : 6;
    render(<SettingsForm defaultValues={testSettings} onSubmit={noop} />);
    const startOfWeekSelect = screen.getByLabelText(/start of week/i);
    fireEvent.change(startOfWeekSelect, {
      target: {
        value: testStartOfWeek.toString(),
      },
    });
    expect(
      screen.getByLabelText(/start of week/i).getAttribute("data-value")
    ).toEqual(testStartOfWeek.toString());
  });
});

test("handles form submission", (done) => {
  const testSettings = randomSettings();
  // testSettings.timesheetRecipients = "";
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

// describe("validates inputs", () => {
//   test("missing timesheet recipients", () => {
//     const testSettings = randomSettings();
//     testSettings.timesheetRecipients = "";
//     render(
//       <SettingsForm
//         defaultValues={testSettings}
//         onSubmit={() => {
//           throw new Error(`onSubmit should not be called with invalid value.`);
//         }}
//       />
//     );
//     userEvent.click(screen.getByText(/save settings/i));
//   });
// });

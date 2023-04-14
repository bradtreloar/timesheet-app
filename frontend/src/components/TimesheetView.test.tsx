import React from "react";
import { randomTimesheet, randomUser } from "fixtures/random";
import { render } from "@testing-library/react";
import TimesheetView from "./TimesheetView";

const testUser = randomUser();
const testTimesheet = randomTimesheet(testUser);

test("renders", () => {
  render(<TimesheetView timesheet={testTimesheet} />);
});

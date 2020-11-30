import { randomShiftTimes } from "fixtures/random";
import { getShiftDuration } from "./shift";

test("getShiftDuration", () => {
  const testShiftTimes = randomShiftTimes();
  const shiftDuration = getShiftDuration(testShiftTimes);
  expect(shiftDuration).toBeGreaterThan(0);
});

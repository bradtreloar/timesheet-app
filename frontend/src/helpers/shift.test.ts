import { randomShiftTimes } from "../fixtures/random";
import { getShiftDuration, getShiftFromTimes } from "./shift";

test("getShiftDuration", () => {
  const testShiftTimes = randomShiftTimes();
  const shiftDuration = getShiftDuration(testShiftTimes);
  expect(shiftDuration).toBeGreaterThan(0);
});

test("getShiftFromTimes", () => {
  const testShiftTimes = randomShiftTimes();
  const testDate = new Date();
  const shift = getShiftFromTimes(testDate, testShiftTimes);
  expect(shift.start instanceof Date).toBe(true);
  expect(shift.end instanceof Date).toBe(true);
  expect(typeof shift.breakDuration).toBe("number");
});

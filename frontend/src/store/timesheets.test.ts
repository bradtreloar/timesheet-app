import store from ".";
import {
  fetchTimesheet,
  fetchTimesheets,
  addTimesheet,
  removeTimesheet,
  selectTimesheets,
  clearTimesheets,
} from "./timesheets";
import * as datastore from "../services/datastore";
import {
  randomInt,
  randomTimesheet,
  randomTimesheets,
  randomUser,
} from "../fixtures/random";
jest.mock("../services/datastore");

beforeEach(() => {
  jest.useFakeTimers();
  const { timesheets } = selectTimesheets(store.getState());
  expect(timesheets).toStrictEqual([]);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();

  // Clear the store
  store.dispatch(clearTimesheets());
  const emptyTimesheets = selectTimesheets(store.getState());
  expect(emptyTimesheets.timesheets).toStrictEqual([]);
});

test("fetch timesheet", async () => {
  const mockUser = randomUser();
  const mockTimesheet = randomTimesheet(mockUser);
  jest.spyOn(datastore, "fetchTimesheet").mockResolvedValue(mockTimesheet);
  if (mockTimesheet.id === undefined) {
    throw "Mock timesheet ID is undefined.";
  }
  const action = await store.dispatch(fetchTimesheet(mockTimesheet.id));
  expect(action.payload).toBe(mockTimesheet);
  expect(action.type).toBe("timesheets/fetch/fulfilled");
  const { status, timesheets } = selectTimesheets(store.getState());
  expect(status).toBe("fulfilled");
  expect(timesheets).toStrictEqual([mockTimesheet]);
});

test("fetch timesheet twice without side effects", async () => {
  const mockUser = randomUser();
  const mockTimesheet = randomTimesheet(mockUser);
  jest.spyOn(datastore, "fetchTimesheet").mockResolvedValue(mockTimesheet);
  if (mockTimesheet.id === undefined) {
    throw "Mock timesheet ID is undefined.";
  }
  for (let i = 0; i < 2; i++) {
    const action = await store.dispatch(fetchTimesheet(mockTimesheet.id));
    expect(action.payload).toBe(mockTimesheet);
    expect(action.type).toBe("timesheets/fetch/fulfilled");
    const { status, timesheets } = selectTimesheets(store.getState());
    expect(status).toBe("fulfilled");
    expect(timesheets).toHaveLength(1);
    expect(timesheets).toStrictEqual([mockTimesheet]);
  }
});

test("fetch timesheets", async () => {
  const mockUser = randomUser();
  const mockTimesheets = randomTimesheets(mockUser, randomInt(5, 10));
  jest.spyOn(datastore, "fetchTimesheets").mockResolvedValue(mockTimesheets);
  const action = await store.dispatch(fetchTimesheets());
  expect(action.payload).toBe(mockTimesheets);
  expect(action.type).toBe("timesheets/fetchAll/fulfilled");
  const { status, timesheets } = selectTimesheets(store.getState());
  expect(status).toBe("fulfilled");
  expect(timesheets).toStrictEqual(mockTimesheets);
});

test("handle failure to fetch timesheets", async () => {
  jest.spyOn(datastore, "fetchTimesheets").mockRejectedValue(undefined);
  const action = await store.dispatch(fetchTimesheets());
  expect(action.payload).toBeUndefined();
  expect(action.type).toBe("timesheets/fetchAll/rejected");
  const { status, timesheets } = selectTimesheets(store.getState());
  expect(status).toBe("rejected");
  expect(timesheets).toStrictEqual([]);
});

test("add timesheet", async () => {
  const mockUser = randomUser();
  const mockTimesheet = randomTimesheet(mockUser);
  const { userID } = mockTimesheet;
  const mockNewTimesheet = { userID };
  jest.spyOn(datastore, "createTimesheet").mockImplementation((timesheet) => {
    expect(timesheet).toBe(mockNewTimesheet);
    return Promise.resolve(mockTimesheet);
  });
  const action = await store.dispatch(addTimesheet(mockNewTimesheet));
  expect(action.payload).toStrictEqual(mockTimesheet);
  expect(action.type).toBe("timesheets/add/fulfilled");
  const { status, timesheets } = selectTimesheets(store.getState());
  expect(status).toBe("fulfilled");
  expect(timesheets).toStrictEqual([mockTimesheet]);
});

test("handle failure to add timesheet", async () => {
  const mockUser = randomUser();
  const mockTimesheet = randomTimesheet(mockUser);
  const { userID } = mockTimesheet;
  const mockNewTimesheet = { userID };
  jest.spyOn(datastore, "createTimesheet").mockRejectedValue(undefined);
  fetchTimesheets();
  const action = await store.dispatch(addTimesheet(mockNewTimesheet));
  expect(action.payload).toBeUndefined();
  expect(action.type).toBe("timesheets/add/rejected");
  const { status, timesheets } = selectTimesheets(store.getState());
  expect(status).toBe("rejected");
  expect(timesheets).toStrictEqual([]);
});

test("delete timesheet", async () => {
  const mockUser = randomUser();
  const mockTimesheets = randomTimesheets(mockUser, randomInt(5, 10));
  jest.spyOn(datastore, "fetchTimesheets").mockResolvedValue(mockTimesheets);
  await store.dispatch(fetchTimesheets());
  const deletedTimesheet = mockTimesheets[0];
  jest.spyOn(datastore, "deleteTimesheet").mockResolvedValue(deletedTimesheet);
  const action = await store.dispatch(removeTimesheet(deletedTimesheet));
  expect(action.payload).toStrictEqual(deletedTimesheet);
  expect(action.type).toBe("timesheets/remove/fulfilled");
  const { status, timesheets } = selectTimesheets(store.getState());
  expect(status).toBe("fulfilled");
  expect(timesheets).not.toContain(deletedTimesheet);
});

test("fail to delete timesheet", async () => {
  const mockUser = randomUser();
  const mockTimesheets = randomTimesheets(mockUser, randomInt(5, 10));
  jest.spyOn(datastore, "fetchTimesheets").mockResolvedValue(mockTimesheets);
  jest.spyOn(datastore, "deleteTimesheet").mockRejectedValue(undefined);
  await store.dispatch(fetchTimesheets());
  const deletedTimesheet = mockTimesheets[0];
  const action = await store.dispatch(removeTimesheet(deletedTimesheet));
  expect(action.payload).toBeUndefined();
  expect(action.type).toBe("timesheets/remove/rejected");
  const { status, timesheets } = selectTimesheets(store.getState());
  expect(status).toBe("rejected");
  expect(timesheets).toContain(deletedTimesheet);
});

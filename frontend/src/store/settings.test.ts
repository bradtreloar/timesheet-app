import store from ".";
import * as datastore from "services/datastore";
import { randomSettings } from "fixtures/random";
import {
  clearSettings,
  fetchSettings,
  fetchUnrestrictedSettings,
  selectSettings,
  updateSettings,
} from "./settings";
jest.mock("services/datastore");

const testSettings = randomSettings();

beforeEach(() => {
  jest.useFakeTimers();
  const { settings } = selectSettings(store.getState());
  expect(settings).toStrictEqual([]);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();

  // Clear the store
  store.dispatch(clearSettings());
});

test("fetch settings", async () => {
  jest.spyOn(datastore, "fetchSettings").mockResolvedValue(testSettings);
  const action = await store.dispatch(fetchSettings());
  expect(action.payload).toBe(testSettings);
  expect(action.type).toBe("settings/fetch/fulfilled");
  const { status, settings } = selectSettings(store.getState());
  expect(status).toBe("fulfilled");
  expect(settings).toStrictEqual(testSettings);
});

test("fetch unrestricted settings", async () => {
  jest
    .spyOn(datastore, "fetchUnrestrictedSettings")
    .mockResolvedValue(testSettings);
  const action = await store.dispatch(fetchUnrestrictedSettings());
  expect(action.payload).toBe(testSettings);
  expect(action.type).toBe("settings/fetch/fulfilled");
  const { status, settings } = selectSettings(store.getState());
  expect(status).toBe("fulfilled");
  expect(settings).toStrictEqual(testSettings);
});

test("handle failure to fetch settings", async () => {
  jest.spyOn(datastore, "fetchSettings").mockRejectedValue(undefined);
  const action = await store.dispatch(fetchSettings());
  expect(action.payload).toBeUndefined();
  expect(action.type).toBe("settings/fetch/rejected");
  const { status, settings } = selectSettings(store.getState());
  expect(status).toBe("rejected");
  expect(settings).toStrictEqual([]);
});

test("update settings", async () => {
  jest.spyOn(datastore, "updateSettings").mockResolvedValue(testSettings);
  const action = await store.dispatch(updateSettings(testSettings));
  expect(action.payload).toStrictEqual(testSettings);
  expect(action.type).toBe("settings/update/fulfilled");
  const { status, settings } = selectSettings(store.getState());
  expect(status).toBe("fulfilled");
  expect(settings).toStrictEqual(testSettings);
});

test("handle failure to update settings", async () => {
  jest.spyOn(datastore, "updateSettings").mockRejectedValue(undefined);
  const action = await store.dispatch(updateSettings(testSettings));
  expect(action.payload).toBeUndefined();
  expect(action.type).toBe("settings/update/rejected");
  const { status, settings } = selectSettings(store.getState());
  expect(status).toBe("rejected");
  expect(settings).toStrictEqual([]);
});

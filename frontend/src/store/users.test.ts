import store from ".";
import {
  fetchUsers,
  addUser,
  selectUsers,
  clearUsers,
  updateUser,
  setUsers,
} from "./users";
import * as datastore from "services/datastore";
import { randomInt, randomUser, randomUsers } from "fixtures/random";
import faker from "faker";
jest.mock("services/datastore");

beforeEach(() => {
  jest.useFakeTimers();
  const { users } = selectUsers(store.getState());
  expect(users).toStrictEqual([]);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();

  // Clear the store
  store.dispatch(clearUsers());
  const emptyUsers = selectUsers(store.getState());
  expect(emptyUsers.users).toStrictEqual([]);
});

test("fetch users", async () => {
  const testUsers = randomUsers(randomInt(5, 10));
  jest.spyOn(datastore, "fetchUsers").mockResolvedValue(testUsers);
  const action = await store.dispatch(fetchUsers());
  expect(action.payload).toBe(testUsers);
  expect(action.type).toBe("users/fetchAll/fulfilled");
  const { status, users } = selectUsers(store.getState());
  expect(status).toBe("fulfilled");
  expect(users).toStrictEqual(testUsers);
});

test("handle failure to fetch users", async () => {
  jest.spyOn(datastore, "fetchUsers").mockRejectedValue(undefined);
  const action = await store.dispatch(fetchUsers());
  expect(action.payload).toBeUndefined();
  expect(action.type).toBe("users/fetchAll/rejected");
  const { status, users } = selectUsers(store.getState());
  expect(status).toBe("rejected");
  expect(users).toStrictEqual([]);
});

test("add user", async () => {
  const testNewUser = randomUser();
  jest.spyOn(datastore, "createUser").mockImplementation((user) => {
    expect(user).toBe(testNewUser);
    return Promise.resolve(user);
  });
  const action = await store.dispatch(addUser(testNewUser));
  expect(action.payload).toStrictEqual(testNewUser);
  expect(action.type).toBe("users/add/fulfilled");
  const { status, users } = selectUsers(store.getState());
  expect(status).toBe("fulfilled");
  expect(users).toStrictEqual([testNewUser]);
});

test("handle failure to add user", async () => {
  const testNewUser = randomUser();
  jest.spyOn(datastore, "createUser").mockRejectedValue(undefined);
  fetchUsers();
  const action = await store.dispatch(addUser(testNewUser));
  expect(action.payload).toBeUndefined();
  expect(action.type).toBe("users/add/rejected");
  const { status, users } = selectUsers(store.getState());
  expect(status).toBe("rejected");
  expect(users).toStrictEqual([]);
});

test("update user", async () => {
  const testUser = randomUser();
  store.dispatch(setUsers([testUser]));
  const testUpdatedUser = Object.assign({}, testUser, {
    email: faker.internet.email(),
  });
  jest.spyOn(datastore, "updateUser").mockImplementation((user) => {
    expect(user).toBe(testUpdatedUser);
    return Promise.resolve(user);
  });
  const action = await store.dispatch(updateUser(testUpdatedUser));
  expect(action.payload).toStrictEqual(testUpdatedUser);
  expect(action.type).toBe("users/update/fulfilled");
  const { status, users } = selectUsers(store.getState());
  expect(status).toBe("fulfilled");
  expect(users).toStrictEqual([testUpdatedUser]);
});

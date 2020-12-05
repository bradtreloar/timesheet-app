import { User } from "types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as datastore from "services/datastore";
import { RootState } from ".";

export interface UsersState {
  users: User[];
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error?: string;
}

const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  return await datastore.fetchUsers();
});

const addUser = createAsyncThunk("users/add", async (user: User) => {
  return await datastore.createUser(user);
});

const updateUser = createAsyncThunk("users/update", async (user: User) => {
  return await datastore.updateUser(user);
});

const deleteUser = createAsyncThunk("users/delete", async (user: User) => {
  return await datastore.deleteUser(user);
});

const initialState: UsersState = {
  users: [],
  status: "idle",
};

const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    clear(state) {
      return {
        users: [],
        status: "idle",
      };
    },
    set(state, action) {
      return {
        users: action.payload,
        status: "idle",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });

    builder
      .addCase(addUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const deletedUser = action.payload;
        state.users = state.users.filter((user) => user.id !== deletedUser.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

const selectUsers = (state: RootState) => state.users;

export { fetchUsers, addUser, updateUser, deleteUser };
export const { clear: clearUsers, set: setUsers } = usersSlice.actions;
export default usersSlice.reducer;
export { selectUsers };

import { Timesheet } from "../types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as datastore from "../services/datastore";
import { RootState } from ".";

export interface TimesheetsState {
  timesheets: Timesheet[];
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error?: string;
}

const fetchTimesheet = createAsyncThunk(
  "timesheets/fetch",
  async (id: string) => {
    return await datastore.fetchTimesheet(id);
  }
);

const fetchTimesheets = createAsyncThunk("timesheets/fetchAll", async () => {
  return await datastore.fetchTimesheets();
});

const addTimesheet = createAsyncThunk(
  "timesheets/add",
  async (timesheet: Timesheet) => {
    return await datastore.createTimesheet(timesheet);
  }
);

const removeTimesheet = createAsyncThunk(
  "timesheets/remove",
  async (timesheet: Timesheet) => {
    return await datastore.deleteTimesheet(timesheet);
  }
);

const initialState: TimesheetsState = {
  timesheets: [],
  status: "idle",
};

const timesheetsSlice = createSlice({
  name: "timesheets",
  initialState: initialState,
  reducers: {
    clear(state) {
      return {
        timesheets: [],
        status: "idle",
      };
    },
    set(state, action) {
      return {
        timesheets: action.payload,
        status: "idle",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimesheet.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchTimesheet.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // Update or add the exam result.
        const existingTimesheet = state.timesheets.find(
          ({ id }) => action.payload.id
        );
        if (existingTimesheet !== undefined) {
          state.timesheets = state.timesheets.map((timesheet) =>
            timesheet.id === action.payload.id ? action.payload : timesheet
          );
        } else {
          state.timesheets.push(action.payload);
        }
      })
      .addCase(fetchTimesheet.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });

    builder
      .addCase(fetchTimesheets.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchTimesheets.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // Replace the exam results in the store.
        state.timesheets = action.payload;
      })
      .addCase(fetchTimesheets.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });

    builder
      .addCase(addTimesheet.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addTimesheet.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.timesheets.push(action.payload);
      })
      .addCase(addTimesheet.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });

    builder
      .addCase(removeTimesheet.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeTimesheet.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.timesheets = state.timesheets.filter(
          (timesheet) => timesheet.id !== action.payload.id
        );
      })
      .addCase(removeTimesheet.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

const selectTimesheets = (state: RootState) => state.timesheets;

export { fetchTimesheet, fetchTimesheets, addTimesheet, removeTimesheet };
export const {
  clear: clearTimesheets,
  set: setTimesheets,
} = timesheetsSlice.actions;
export default timesheetsSlice.reducer;
export { selectTimesheets };

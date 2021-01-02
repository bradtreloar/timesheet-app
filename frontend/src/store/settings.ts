import { Setting } from "types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as datastore from "services/datastore";
import { RootState } from ".";

export interface SettingsState {
  settings: Setting[];
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error?: string;
}

const fetchSettings = createAsyncThunk("settings/fetch", async () => {
  return await datastore.fetchSettings();
});

const fetchUnrestrictedSettings = createAsyncThunk(
  "settings/fetch",
  async () => {
    return await datastore.fetchUnrestrictedSettings();
  }
);

const updateSettings = createAsyncThunk(
  "settings/update",
  async (settings: Setting[]) => {
    return await datastore.updateSettings(settings);
  }
);

const initialState: SettingsState = {
  settings: [],
  status: "idle",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    clear(state) {
      return {
        settings: [],
        status: "idle",
      };
    },
    set(state, action: PayloadAction<Setting[]>) {
      return {
        settings: action.payload,
        status: "idle",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });

    builder
      .addCase(updateSettings.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

const selectSettings = (state: RootState) => state.settings;

export { fetchSettings, fetchUnrestrictedSettings, updateSettings };
export const { clear: clearSettings, set: setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
export { selectSettings };

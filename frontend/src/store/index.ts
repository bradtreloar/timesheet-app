import { configureStore } from "@reduxjs/toolkit";
import timesheets from "./timesheets";
import settings from "./settings";

const store = configureStore({
  reducer: {
    settings,
    timesheets,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

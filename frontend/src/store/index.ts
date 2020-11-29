import { configureStore } from "@reduxjs/toolkit";
import timesheets from "./timesheets";

const store = configureStore({
  reducer: {
    timesheets,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

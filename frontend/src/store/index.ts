import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import timesheets from "./timesheets";

const middleware = [
  ...getDefaultMiddleware(),
];

const store = configureStore({
  reducer: {
    timesheets
  },
  middleware,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

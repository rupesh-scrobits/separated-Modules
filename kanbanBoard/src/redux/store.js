import { configureStore, combineReducers } from "@reduxjs/toolkit";

import ProjectSlice from "./features/projectSlices/ProjectManagementSlice";
import VendorSlice from "./features/projectSlices/VendorSlice";

const rootReducer = combineReducers({
  ProjectSlice,
  VendorSlice,
});

const store = configureStore({
  reducer: {
    feature: rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;

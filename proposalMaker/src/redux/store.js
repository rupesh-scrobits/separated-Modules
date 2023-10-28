import { configureStore, combineReducers } from "@reduxjs/toolkit";
import proposalMakerSlice from "./features/ProposalMakerSlice";

const rootReducer = combineReducers({
  ProposalMaker: proposalMakerSlice,
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

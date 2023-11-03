import { configureStore } from "@reduxjs/toolkit";
import gravesReducer from "./features/gravesSlice";
import singleGraveReducer from "./features/singleGraveSlice";
import singleUserReducer from "./features/userSlice";
import allUsersSliceReducer from "./features/allUsersSlice";
import allDeceasedSliceReducer from "./features/deceasedSlice";
import allCemeteriesSliceReducer from "./features/cemeteriesSlice";

const store = configureStore({
  reducer: {
    graves: gravesReducer,
    singleGrave: singleGraveReducer,
    singleUser: singleUserReducer,
    allUsers: allUsersSliceReducer,
    allDeceased: allDeceasedSliceReducer,
    allCemeteries: allCemeteriesSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

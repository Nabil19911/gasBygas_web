import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "./silces/profileSlice";

export const rootReducer = combineReducers({
  profile: profileReducer,
});

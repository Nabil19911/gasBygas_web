import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "./silces/profileSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import { createTransform } from "redux-persist";

const GetTransform = createTransform(
  (inboundState, _) => {
    return JSON.stringify(inboundState);
  },
  (outboundState, _) => {
    return JSON.parse(outboundState);
  }
);

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: hardSet,
  transforms: [GetTransform],
};

export const rootReducer = combineReducers({
  profile: persistReducer(persistConfig, profileReducer),
});

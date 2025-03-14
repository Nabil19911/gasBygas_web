import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "./silces/profileSlice";
import customersReducer from "./silces/customerSlice";
import outletsReducer from "./silces/outletSlice";
import employeesReducer from "./silces/employeeSlice";
import scheduleReducer from "./silces/scheduleSlice";
import gasRequestReducer from "./silces/gasRequestSlice";
import stockReducer from "./silces/stockSlice";
import gasTypeReducer from "./silces/gasTypeSlice";
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
  customers: customersReducer,
  outlets: outletsReducer,
  employees: employeesReducer,
  stock: stockReducer,
  schedule: scheduleReducer,
  gasRequest: gasRequestReducer,
  gasType: gasTypeReducer,
});

import { RootState } from "../store";

export const getCustomers = (state: RootState) => state.customers.customers;

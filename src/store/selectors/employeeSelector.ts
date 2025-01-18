import { RootState } from "../store";

export const getAllEmployees = (state: RootState) => state.employees.employees;

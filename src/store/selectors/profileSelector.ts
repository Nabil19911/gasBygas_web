import { RootState } from "../store";

export const getEmployeeProfile = (state: RootState) =>
  state.profile.employeeProfile;
export const getCustomerProfile = (state: RootState) =>
  state.profile.customerProfile;

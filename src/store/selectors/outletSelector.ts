import { RootState } from "../store";

export const getAllOutlets = (state: RootState) => state.outlets.outlets;

export const getAllOutletGasRequest = (state: RootState) =>
  state.outlets.outletGasRequets;

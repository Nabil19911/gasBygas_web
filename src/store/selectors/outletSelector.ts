import { RootState } from "../store";

export const getAllOutlets = (state: RootState) => state.outlets.outlets;

export const getOutletGasRequestById = (state: RootState) =>
  state.outlets.outletGasRequets;

export const getAllOutletGasRequest = (state: RootState) =>
  state.outlets.allOutletGasRequets;

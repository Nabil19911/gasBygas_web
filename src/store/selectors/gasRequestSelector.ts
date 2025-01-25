import { RootState } from "../store";

export const getGasRequest = (state: RootState) => state.gasRequest.gasRequest;
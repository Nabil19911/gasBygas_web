import { RootState } from "../store";

export const getIndividualGasRequest = (state: RootState) => state.gasRequest.individualGasRequest;
export const getOrganizationGasRequest = (state: RootState) => state.gasRequest.organizationGasRequest;
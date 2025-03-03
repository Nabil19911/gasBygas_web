import { RootState } from "../store";

export const getGasTypes = (state: RootState) => state.gasType.gasTypes;

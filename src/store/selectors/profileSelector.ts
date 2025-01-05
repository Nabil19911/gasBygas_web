import { RootState } from "../store";

export const getProfileDetails = (state: RootState) => state.profile.profile;

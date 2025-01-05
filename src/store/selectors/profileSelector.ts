import { RootState } from "../store";

export const getUserProfile = (state: RootState) => state.profile.userProfile;

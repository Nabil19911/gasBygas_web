import { RootState } from "../store";

export const getSchedule = (state: RootState) => state.schedule.schedule;
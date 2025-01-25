import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IApiError from "../../type/IApiError";
import { ISchedule } from "../../type/IDeliveryRequest";
import appFetch from "../../utils/appFetch";

interface InitialState {
  schedule: {
    data: ISchedule[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  schedule: {
    data: null,
    status: FetchStateEnum.IDLE,
    error: null,
  },
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.schedule.status = FetchStateEnum.PENDING;
        state.schedule.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.schedule.status = FetchStateEnum.FULFILLED;
        state.schedule.data = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.schedule.status = FetchStateEnum.REJECTED;
        state.schedule.error = action.payload || null;
      });
  },
});

export const fetchSchedule = createAsyncThunk<
  ISchedule[],
  void,
  { rejectValue: IApiError }
>("schedule/fetchSchedule", async (_, { rejectWithValue }) => {
  try {
    const response = await appFetch<ISchedule[]>({
      url: `/schedule`,
      method: "get",
    });

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as IApiError);
    }
    throw error;
  }
});

export default scheduleSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IApiError from "../../type/IApiError";
import IGasRequest from "../../type/IGasRequest";
import appFetch from "../../utils/appFetch";

interface InitialState {
  gasRequest: {
    data: IGasRequest[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  gasRequest: {
    data: null,
    status: FetchStateEnum.IDLE,
    error: null,
  },
};

const scheduleSlice = createSlice({
  name: "gasRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGasRequest.pending, (state) => {
        state.gasRequest.status = FetchStateEnum.PENDING;
        state.gasRequest.error = null;
      })
      .addCase(fetchGasRequest.fulfilled, (state, action) => {
        state.gasRequest.status = FetchStateEnum.FULFILLED;
        state.gasRequest.data = action.payload;
      })
      .addCase(fetchGasRequest.rejected, (state, action) => {
        state.gasRequest.status = FetchStateEnum.REJECTED;
        state.gasRequest.error = action.payload || null;
      });
  },
});

export const fetchGasRequest = createAsyncThunk<
  IGasRequest[],
  { userId?: string; outletId?: string; tokenId?: string },
  { rejectValue: IApiError }
>("gasRequest/fetchGasRequest", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();

    const response = await appFetch<IGasRequest[]>({
      url: `/gas-request?${query}`,
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

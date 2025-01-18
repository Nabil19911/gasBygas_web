import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IApiError from "../../type/IApiError";
import { IOutlet } from "../../type/IOutlet";
import appFetch from "../../utils/appFetch";

interface InitialState {
  outlets: {
    data: IOutlet[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  outlets: {
    data: null,
    status: FetchStateEnum.IDLE,
    error: null,
  },
};

const outletSlice = createSlice({
  name: "outlet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutlets.pending, (state) => {
        state.outlets.status = FetchStateEnum.PENDING;
        state.outlets.error = null;
      })
      .addCase(fetchOutlets.fulfilled, (state, action) => {
        state.outlets.status = FetchStateEnum.FULFILLED;
        state.outlets.data = action.payload;
      })
      .addCase(fetchOutlets.rejected, (state, action) => {
        state.outlets.status = FetchStateEnum.REJECTED;
        state.outlets.error = action.payload || null;
      });
  },
});

export const fetchOutlets = createAsyncThunk<
  IOutlet[],
  void,
  { rejectValue: IApiError }
>("outlet/fetchOutlets", async (_, { rejectWithValue }) => {
  try {
    const response = await appFetch<IOutlet[]>({
      url: `/outlet`,
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

export default outletSlice.reducer;

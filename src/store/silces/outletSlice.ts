import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IApiError from "../../type/IApiError";
import { IOutlet } from "../../type/IOutlet";
import appFetch from "../../utils/appFetch";
import { IOutletGasRequest } from "../../type/IOutletGasRequest";

interface InitialState {
  outlets: {
    data: IOutlet[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
  outletGasRequets: {
    data: IOutletGasRequest[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
  allOutletGasRequets: {
    data: IOutletGasRequest[] | null;
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
  outletGasRequets: {
    data: null,
    status: FetchStateEnum.IDLE,
    error: null,
  },
  allOutletGasRequets: {
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
      })
      .addCase(fetchOutletGasRequests.pending, (state) => {
        state.outletGasRequets.status = FetchStateEnum.PENDING;
        state.outletGasRequets.error = null;
      })
      .addCase(fetchOutletGasRequests.fulfilled, (state, action) => {
        state.outletGasRequets.status = FetchStateEnum.FULFILLED;
        state.outletGasRequets.data = action.payload;
      })
      .addCase(fetchOutletGasRequests.rejected, (state, action) => {
        state.outletGasRequets.status = FetchStateEnum.REJECTED;
        state.outletGasRequets.error = action.payload || null;
      })
      .addCase(fetchAllOutletGasRequests.pending, (state) => {
        state.allOutletGasRequets.status = FetchStateEnum.PENDING;
        state.allOutletGasRequets.error = null;
      })
      .addCase(fetchAllOutletGasRequests.fulfilled, (state, action) => {
        state.allOutletGasRequets.status = FetchStateEnum.FULFILLED;
        state.allOutletGasRequets.data = action.payload;
      })
      .addCase(fetchAllOutletGasRequests.rejected, (state, action) => {
        state.allOutletGasRequets.status = FetchStateEnum.REJECTED;
        state.allOutletGasRequets.error = action.payload || null;
      })
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

export const fetchOutletGasRequests = createAsyncThunk<
  IOutletGasRequest[],
  { outletId: string },
  { rejectValue: IApiError }
>(
  "outlet/fetchOutletGasRequests",
  async ({ outletId }, { rejectWithValue }) => {
    try {
      const response = await appFetch<IOutletGasRequest[]>({
        url: `/outlet/gas-request/${outletId}`,
        method: "get",
      });

      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as IApiError);
      }
      throw error;
    }
  }
);

export const fetchAllOutletGasRequests = createAsyncThunk<
  IOutletGasRequest[],
  void,
  { rejectValue: IApiError }
>("outlet/fetchAllOutletGasRequests", async (_, { rejectWithValue }) => {
  try {
    const response = await appFetch<IOutletGasRequest[]>({
      url: `/outlet/gas-request/`,
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

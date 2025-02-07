import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IApiError from "../../type/IApiError";
import {
  IIndividualCustomerGasRequest,
  IOrganizationGasRequest,
} from "../../type/IGasRequest";
import appFetch from "../../utils/appFetch";

interface InitialState {
  individualGasRequest: {
    data: IIndividualCustomerGasRequest[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
  organizationGasRequest: {
    data: IOrganizationGasRequest[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  individualGasRequest: {
    data: null,
    status: FetchStateEnum.IDLE,
    error: null,
  },
  organizationGasRequest: {
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
      .addCase(fetchIndividualGasRequest.pending, (state) => {
        state.individualGasRequest.status = FetchStateEnum.PENDING;
        state.individualGasRequest.error = null;
      })
      .addCase(fetchIndividualGasRequest.fulfilled, (state, action) => {
        state.individualGasRequest.status = FetchStateEnum.FULFILLED;
        state.individualGasRequest.data = action.payload;
      })
      .addCase(fetchIndividualGasRequest.rejected, (state, action) => {
        state.individualGasRequest.status = FetchStateEnum.REJECTED;
        state.individualGasRequest.error = action.payload || null;
      })
      .addCase(fetchOrganizationGasRequest.pending, (state) => {
        state.organizationGasRequest.status = FetchStateEnum.PENDING;
        state.organizationGasRequest.error = null;
      })
      .addCase(fetchOrganizationGasRequest.fulfilled, (state, action) => {
        state.organizationGasRequest.status = FetchStateEnum.FULFILLED;
        state.organizationGasRequest.data = action.payload;
      })
      .addCase(fetchOrganizationGasRequest.rejected, (state, action) => {
        state.organizationGasRequest.status = FetchStateEnum.REJECTED;
        state.organizationGasRequest.error = action.payload || null;
      });
  },
});

export const fetchIndividualGasRequest = createAsyncThunk<
  IIndividualCustomerGasRequest[],
  { userId?: string; outletId?: string; tokenId?: string },
  { rejectValue: IApiError }
>(
  "gasRequest/fetchIndividualGasRequest",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();

      const response = await appFetch<IIndividualCustomerGasRequest[]>({
        url: `/gas-request/individual?${query}`,
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

export const fetchOrganizationGasRequest = createAsyncThunk<
  IOrganizationGasRequest[],
  { userId?: string; outletId?: string; tokenId?: string },
  { rejectValue: IApiError }
>(
  "gasRequest/fetchOrganizationGasRequest",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();

      const response = await appFetch<IOrganizationGasRequest[]>({
        url: `/gas-request/organization?${query}`,
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

export default scheduleSlice.reducer;

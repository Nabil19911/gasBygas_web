import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchState from "../../constant/fetchState";
import IApiError from "../../type/IApiError";
import baseAxiosInstance from "../../utils/baseAxios";
import ICustomerProfileResponse from "../../type/ICustomerProfileResponse";
import IEmployeeProfileResponse from "../../type/IEmployeeProfileResponse";

interface InitialState {
  userProfile: {
    data: ICustomerProfileResponse | IEmployeeProfileResponse | null;
    status: FetchState;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  userProfile: {
    data: null,
    status: FetchState.IDLE,
    error: null,
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Employee Profile
      .addCase(fetchEmployeeProfileDetail.pending, (state) => {
        state.userProfile.status = FetchState.PENDING;
        state.userProfile.error = null;
      })
      .addCase(fetchEmployeeProfileDetail.fulfilled, (state, action) => {
        state.userProfile.status = FetchState.FULFILLED;
        state.userProfile.data = action.payload;
      })
      .addCase(fetchEmployeeProfileDetail.rejected, (state, action) => {
        state.userProfile.status = FetchState.REJECTED;
        state.userProfile.error = action.payload || null;
      })
      // Customer Profile
      .addCase(fetchCustomerProfileDetail.pending, (state) => {
        state.userProfile.status = FetchState.PENDING;
        state.userProfile.error = null;
      })
      .addCase(fetchCustomerProfileDetail.fulfilled, (state, action) => {
        state.userProfile.status = FetchState.FULFILLED;
        state.userProfile.data = action.payload;
      })
      .addCase(fetchCustomerProfileDetail.rejected, (state, action) => {
        state.userProfile.status = FetchState.REJECTED;
        state.userProfile.error = action.payload || null;
      });
  },
});

// Employee Profile Thunk
export const fetchEmployeeProfileDetail = createAsyncThunk<
  IEmployeeProfileResponse,
  string,
  { rejectValue: IApiError }
>(
  "profile/fetchEmployeeProfileDetail",
  async (username, { rejectWithValue }) => {
    try {
      const response = await baseAxiosInstance.post(`/employee/profile`, {
        username,
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as IApiError);
      }
      throw error;
    }
  }
);

// Customer Profile Thunk
export const fetchCustomerProfileDetail = createAsyncThunk<
  ICustomerProfileResponse,
  string,
  { rejectValue: IApiError }
>("profile/fetchCustomerProfileDetail", async (email, { rejectWithValue }) => {
  try {
    const response = await baseAxiosInstance.post(`/customer/profile`, {
      email,
    });

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as IApiError);
    }
    throw error;
  }
});

export default profileSlice.reducer;

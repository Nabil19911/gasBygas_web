import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IApiError from "../../type/IApiError";
import ICustomer from "../../type/ICustomer";
import IEmployee from "../../type/IEmployee";
import appFetch from "../../utils/appFetch";

export type TProfileData = Partial<ICustomer & IEmployee>;

interface InitialState {
  userProfile: {
    data: TProfileData | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  userProfile: {
    data: null,
    status: FetchStateEnum.IDLE,
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
        state.userProfile.status = FetchStateEnum.PENDING;
        state.userProfile.error = null;
      })
      .addCase(fetchEmployeeProfileDetail.fulfilled, (state, action) => {
        state.userProfile.status = FetchStateEnum.FULFILLED;
        state.userProfile.data = action.payload;
      })
      .addCase(fetchEmployeeProfileDetail.rejected, (state, action) => {
        state.userProfile.status = FetchStateEnum.REJECTED;
        state.userProfile.error = action.payload || null;
      })
      // Customer Profile
      .addCase(fetchCustomerProfileDetail.pending, (state) => {
        state.userProfile.status = FetchStateEnum.PENDING;
        state.userProfile.error = null;
      })
      .addCase(fetchCustomerProfileDetail.fulfilled, (state, action) => {
        state.userProfile.status = FetchStateEnum.FULFILLED;
        state.userProfile.data = action.payload;
      })
      .addCase(fetchCustomerProfileDetail.rejected, (state, action) => {
        state.userProfile.status = FetchStateEnum.REJECTED;
        state.userProfile.error = action.payload || null;
      });
  },
});

// Employee Profile Thunk
export const fetchEmployeeProfileDetail = createAsyncThunk<
  IEmployee,
  string,
  { rejectValue: IApiError }
>(
  "profile/fetchEmployeeProfileDetail",
  async (username, { rejectWithValue }) => {
    try {
      const response = await appFetch<IEmployee>({
        url: `/employee/profile`,
        method: "post",
        data: {
          username,
        },
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

// Customer Profile Thunk
export const fetchCustomerProfileDetail = createAsyncThunk<
  ICustomer,
  string,
  { rejectValue: IApiError }
>("profile/fetchCustomerProfileDetail", async (email, { rejectWithValue }) => {
  try {
    const response = await appFetch<ICustomer>({
      url: `/user/profile`,
      method: "post",
      data: {
        email,
      },
    });

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as IApiError);
    }
    throw error;
  }
});

export default profileSlice.reducer;

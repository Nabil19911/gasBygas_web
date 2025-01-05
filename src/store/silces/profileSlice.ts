import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchState from "../../constant/fetchState";
import IApiError from "../../type/IApiError";
import baseAxiosInstance from "../../utils/baseAxios";
import ICustomerProfileResponse from "../../type/ICustomerProfileResponse";
import IEmployeeProfileResponse from "../../type/IEmployeeProfileResponse";

interface InitialState {
  profile: {
    data: IEmployeeProfileResponse | ICustomerProfileResponse;
    status: FetchState;
  };
}

const initialState: InitialState = {
  profile: {
    data: {} as IEmployeeProfileResponse | ICustomerProfileResponse,
    status: FetchState.IDEL,
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeProfileDetail.pending, (state) => {
        state.profile.status = FetchState.PENDING;
      })
      .addCase(fetchEmployeeProfileDetail.fulfilled, (state, action) => {
        state.profile.status = FetchState.FULFILED;
        state.profile.data = action.payload;
      })
      .addCase(fetchCustomerProfileDetail.pending, (state) => {
        state.profile.status = FetchState.PENDING;
      })
      .addCase(fetchCustomerProfileDetail.fulfilled, (state, action) => {
        state.profile.status = FetchState.FULFILED;
        state.profile.data = action.payload;
      });
  },
});

export const fetchEmployeeProfileDetail = createAsyncThunk<
  IEmployeeProfileResponse,
  string,
  { rejectValue: IApiError }
>("profile/employee", async (username, { rejectWithValue }) => {
  try {
    const response = await baseAxiosInstance.post(`/employee/profile`, {
      username,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as IApiError);
    }
    throw error;
  }
});

export const fetchCustomerProfileDetail = createAsyncThunk<
  ICustomerProfileResponse,
  string,
  { rejectValue: IApiError }
>("profile/customer", async (email, { rejectWithValue }) => {
  try {
    const response = await baseAxiosInstance.post(`/customer/profile`, {
      email,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as IApiError);
    }
    throw error;
  }
});

export default profileSlice.reducer;

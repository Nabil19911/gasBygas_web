import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IApiError from "../../type/IApiError";
import ICustomer from "../../type/ICustomer";
import appFetch from "../../utils/appFetch";

interface InitialState {
  customers: {
    data: ICustomer[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  customers: {
    data: null,
    status: FetchStateEnum.IDLE,
    error: null,
  },
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.customers.status = FetchStateEnum.PENDING;
        state.customers.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers.status = FetchStateEnum.FULFILLED;
        state.customers.data = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customers.status = FetchStateEnum.REJECTED;
        state.customers.error = action.payload || null;
      });
  },
});

export const fetchCustomers = createAsyncThunk<
  ICustomer[],
  void,
  { rejectValue: IApiError }
>("customer/fetchCustomers", async (_, { rejectWithValue }) => {
  try {
    const response = await appFetch<ICustomer[]>({
      url: `/user`,
      method: "get",
    });

    return response;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as IApiError);
    }
    throw error;
  }
});

export default customerSlice.reducer;

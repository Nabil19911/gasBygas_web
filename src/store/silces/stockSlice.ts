import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IApiError from "../../type/IApiError";
import IStock from "../../type/IStock";
import appFetch from "../../utils/appFetch";

interface InitialState {
  stock: {
    data: IStock | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  stock: {
    data: null,
    status: FetchStateEnum.IDLE,
    error: null,
  },
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStock.pending, (state) => {
        state.stock.status = FetchStateEnum.PENDING;
        state.stock.error = null;
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.stock.status = FetchStateEnum.FULFILLED;
        state.stock.data = action.payload;
      })
      .addCase(fetchStock.rejected, (state, action) => {
        state.stock.status = FetchStateEnum.REJECTED;
        state.stock.error = action.payload || null;
      });
  },
});

export const fetchStock = createAsyncThunk<
  IStock,
  void,
  { rejectValue: IApiError }
>("stock/fetchStock", async (_, { rejectWithValue }) => {
  try {
    const response = await appFetch<IStock>({
      url: `/stock`,
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

export default stockSlice.reducer;

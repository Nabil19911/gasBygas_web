import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IGasType from "../../type/IGasType";
import IApiError from "../../type/IApiError";
import appFetch from "../../utils/appFetch";
import axios from "axios";

interface InitialState {
  gasTypes: {
    data: IGasType[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  gasTypes: {
    data: null,
    status: FetchStateEnum.IDLE,
    error: null,
  },
};

const gasTypeSlice = createSlice({
  name: "gasType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGasTypes.pending, (state) => {
        state.gasTypes.status = FetchStateEnum.PENDING;
        state.gasTypes.error = null;
      })
      .addCase(fetchGasTypes.fulfilled, (state, action) => {
        state.gasTypes.status = FetchStateEnum.FULFILLED;
        state.gasTypes.data = action.payload;
      })
      .addCase(fetchGasTypes.rejected, (state, action) => {
        state.gasTypes.status = FetchStateEnum.REJECTED;
        state.gasTypes.error = action.payload || null;
      });
  },
});

export const fetchGasTypes = createAsyncThunk<
  IGasType[],
  void,
  { rejectValue: IApiError }
>("gasType/fetchGasTypes", async (_, { rejectWithValue }) => {
  try {
    const response = await appFetch<IGasType[]>({
      url: `/gas-type`,
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

export default gasTypeSlice.reducer;

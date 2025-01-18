import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FetchStateEnum from "../../constant/fetchStateEnum";
import IApiError from "../../type/IApiError";
import IEmployee from "../../type/IEmployee";
import appFetch from "../../utils/appFetch";

interface InitialState {
  employees: {
    data: IEmployee[] | null;
    status: FetchStateEnum;
    error: IApiError | null;
  };
}

const initialState: InitialState = {
  employees: {
    data: null,
    status: FetchStateEnum.IDLE,
    error: null,
  },
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.employees.status = FetchStateEnum.PENDING;
        state.employees.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees.status = FetchStateEnum.FULFILLED;
        state.employees.data = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.employees.status = FetchStateEnum.REJECTED;
        state.employees.error = action.payload || null;
      });
  },
});

export const fetchEmployees = createAsyncThunk<
  IEmployee[],
  void,
  { rejectValue: IApiError }
>("employee/fetchEmployees", async (_, { rejectWithValue }) => {
  try {
    const response = await appFetch<IEmployee[]>({
      url: `/employee`,
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

export default employeeSlice.reducer;

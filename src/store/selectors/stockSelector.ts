import { RootState } from "../store";

export const getStock = (state: RootState) => state.stock.stock;

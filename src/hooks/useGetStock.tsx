import { useEffect } from "react";
import { fetchStock } from "../store/silces/stockSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getStock } from "../store/selectors/stockSelector";
import IStock from "../type/IStock";

const useGetStock = () => {
  const value = useAppSelector(getStock);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    await dispatch(fetchStock());
  };

  useEffect(() => {
    if (!value || value?.status === FetchStateEnum.IDLE) {
      fetchData();
    }
  }, [dispatch, value?.status]);

  const isLoading = value?.status !== FetchStateEnum.FULFILLED;
  return {
    data: value?.data || {} as IStock,
    isLoading,
    error: value?.error?.message,
  };
};

export default useGetStock;

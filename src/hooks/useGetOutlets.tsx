import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getAllOutlets } from "../store/selectors/outletSelector";
import { fetchOutlets } from "../store/silces/outletSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const useGetOutlets = () => {
  const value = useAppSelector(getAllOutlets);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    await dispatch(fetchOutlets());
  };

  useEffect(() => {
    if (!value || value?.status === FetchStateEnum.IDLE) {
      fetchData();
    }
  }, [dispatch, value?.status]);

  const isLoading = value?.status !== FetchStateEnum.FULFILLED;
  return {
    data: value?.data || [],
    isLoading,
    error: value?.error?.message,
    fetchData,
  };
};

export default useGetOutlets;

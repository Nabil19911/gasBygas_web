import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getCustomers } from "../store/selectors/customerSelector";
import { fetchCustomers } from "../store/silces/customerSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const useGetCustomers = () => {
  const value = useAppSelector(getCustomers);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    await dispatch(fetchCustomers());
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
  };
};

export default useGetCustomers;

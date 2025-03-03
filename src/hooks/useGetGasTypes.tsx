import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getGasTypes } from "../store/selectors/gasTypeSelector";
import { fetchGasTypes } from "../store/silces/gasTypeSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const useGetGasTypes = () => {
  const value = useAppSelector(getGasTypes);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    await dispatch(fetchGasTypes());
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

export default useGetGasTypes;

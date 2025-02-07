import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchOrganizationGasRequest } from "../store/silces/gasRequestSlice";
import { getOrganizationGasRequest } from "../store/selectors/gasRequestSelector";

const useGetAllOrganizationGasRequest = () => {
  const value = useAppSelector(getOrganizationGasRequest);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    await dispatch(fetchOrganizationGasRequest({}));
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

export default useGetAllOrganizationGasRequest;

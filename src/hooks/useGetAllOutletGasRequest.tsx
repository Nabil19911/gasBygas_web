import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getAllOutletGasRequest } from "../store/selectors/outletSelector";
import { fetchOutletGasRequests } from "../store/silces/outletSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

interface IUseGetAllOutletGasRequestProps {
  outletId: string;
}

const useGetAllOutletGasRequest = ({
  outletId,
}: IUseGetAllOutletGasRequestProps) => {
  const value = useAppSelector(getAllOutletGasRequest);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    await dispatch(fetchOutletGasRequests({outletId}));
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

export default useGetAllOutletGasRequest;

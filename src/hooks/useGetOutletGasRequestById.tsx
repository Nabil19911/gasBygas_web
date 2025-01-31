import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getOutletGasRequestById } from "../store/selectors/outletSelector";
import { fetchOutletGasRequests } from "../store/silces/outletSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

interface IUseGetAllOutletGasRequestProps {
  outletId: string;
}

const useGetOutletGasRequestById = ({
  outletId,
}: IUseGetAllOutletGasRequestProps) => {
  const value = useAppSelector(getOutletGasRequestById);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    if (outletId) {
      await dispatch(fetchOutletGasRequests({ outletId }));
    }
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

export default useGetOutletGasRequestById;

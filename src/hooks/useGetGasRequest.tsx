import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getGasRequest } from "../store/selectors/gasRequestSelector";
import { fetchGasRequest } from "../store/silces/gasRequestSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

interface IUseGetGasRequestProps {
  userId?: string;
  outletId?: string;
  tokenId?: string;
}

const useGetGasRequest = ({
  userId,
  outletId,
  tokenId,
}: IUseGetGasRequestProps) => {
  const value = useAppSelector(getGasRequest);
  const dispatch = useAppDispatch();

  const fetchData = async ({
    userId,
    outletId,
    tokenId,
  }: IUseGetGasRequestProps) => {
    await dispatch(fetchGasRequest({ userId, outletId, tokenId }));
  };

  useEffect(() => {
    if (!value || value?.status === FetchStateEnum.IDLE) {
      fetchData({ userId, outletId, tokenId });
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

export default useGetGasRequest;

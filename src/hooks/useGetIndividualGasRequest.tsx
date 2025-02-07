import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getIndividualGasRequest } from "../store/selectors/gasRequestSelector";
import { fetchIndividualGasRequest } from "../store/silces/gasRequestSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

interface IUseGetGasRequestProps {
  userId?: string;
  outletId?: string;
  tokenId?: string;
}

const useGetIndividualGasRequest = ({
  userId,
  outletId,
  tokenId,
}: IUseGetGasRequestProps) => {
  const value = useAppSelector(getIndividualGasRequest);
  const dispatch = useAppDispatch();

  const fetchData = async ({
    userId,
    outletId,
    tokenId,
  }: IUseGetGasRequestProps) => {
    await dispatch(fetchIndividualGasRequest({ userId, outletId, tokenId }));
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

export default useGetIndividualGasRequest;

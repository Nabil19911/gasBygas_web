import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchOrganizationGasRequest } from "../store/silces/gasRequestSlice";
import { getOrganizationGasRequest } from "../store/selectors/gasRequestSelector";

interface IUseGetOrganizationGasRequestProps {
  userId?: string;
  tokenId?: string;
}

const useGetOrganizationGasRequest = ({
  userId,
  tokenId,
}: IUseGetOrganizationGasRequestProps) => {
  const value = useAppSelector(getOrganizationGasRequest);
  const dispatch = useAppDispatch();

  const fetchData = async ({
    userId,
    tokenId,
  }: IUseGetOrganizationGasRequestProps) => {
    await dispatch(fetchOrganizationGasRequest({ userId, tokenId }));
  };

  useEffect(() => {
    if (!value || value?.status === FetchStateEnum.IDLE) {
      fetchData({ userId, tokenId });
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

export default useGetOrganizationGasRequest;

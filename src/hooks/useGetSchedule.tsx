import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getSchedule } from "../store/selectors/scheduleSelector";
import { fetchSchedule } from "../store/silces/scheduleSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const useGetSchedule = () => {
  const value = useAppSelector(getSchedule);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    await dispatch(fetchSchedule());
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

export default useGetSchedule;

import { useEffect } from "react";
import FetchStateEnum from "../constant/fetchStateEnum";
import { getAllEmployees } from "../store/selectors/employeeSelector";
import { fetchEmployees } from "../store/silces/employeeSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const useGetEmployees = () => {
  const value = useAppSelector(getAllEmployees);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    await dispatch(fetchEmployees());
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

export default useGetEmployees;

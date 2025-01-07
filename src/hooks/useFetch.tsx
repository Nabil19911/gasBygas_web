import { useCallback, useEffect, useState } from "react";
import { handleAxiosError } from "../helpers/axiosHelper";
import appFetch from "../utils/appFetch";

interface UseFetchOptions {
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface IFetchProps {
  url: string;
  initialLoad?: boolean;
  options?: UseFetchOptions;
}

const useFetch = <T extends unknown>({
  url,
  initialLoad = false,
  options = {},
}: IFetchProps) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | null>();

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const responseData: T = await appFetch({
        url,
        method: "get",
        data: options.data,
        headers: options.headers,
      });
      setData(responseData);
      setError(null);
    } catch (error) {
      const axiosErrorMeesage = handleAxiosError(error as string);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(axiosErrorMeesage || errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (initialLoad) {
      fetchData();
    }
  }, []);

  return { data, error, isLoading, getNewData: fetchData };
};

export default useFetch;

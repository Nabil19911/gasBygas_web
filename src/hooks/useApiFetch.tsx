import { useCallback, useState } from "react";
import { handleAxiosError } from "../helpers/axiosHelper";
import appFetch from "../utils/appFetch";

interface IUseApiFetchOptions {
  headers?: Record<string, string>;
  method?: "get" | "post" | "put" | "delete";
}

interface UsePostResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  postData: (postData: T) => Promise<void>;
  cancelRequest: () => void;
}

interface IUseApiFetchProps {
  url: string;
  options?: IUseApiFetchOptions;
}

const useApiFetch = <T extends unknown>({
  url,
  options = {},
}: IUseApiFetchProps): UsePostResponse<T> => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortController = new AbortController();

  const cancelRequest = useCallback(() => {
    abortController.abort();
  }, [abortController]);

  const postData = useCallback(
    async (postData: T) => {
      setLoading(true);
      setError(null);

      try {
        const responseData: T = await appFetch({
          url,
          method: options?.method || "post",
          data: postData,
          headers: options?.headers,
          signal: abortController.signal,
        });

        setData(responseData);
      } catch (error) {
        if (abortController.signal.aborted) {
          setError("Request cancelled");
        } else {
          const axiosErrorMessage = handleAxiosError(error as string);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          setError(axiosErrorMessage || errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [url, options, abortController]
  );

  return { data, isLoading, error, postData, cancelRequest };
};

export default useApiFetch;

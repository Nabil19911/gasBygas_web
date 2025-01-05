import axios from "axios";
import GeneralEnum from "../constant/generalEnum";

const baseAxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to include token if available
baseAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(GeneralEnum.ACCESSTOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default baseAxiosInstance;

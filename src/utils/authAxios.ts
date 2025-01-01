import axios from "axios";

const authAxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

authAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Unauthorized! Please check your login credentials.");
      }
      if (error.response.status === 500) {
        console.log("Server error. Please try again later.");
      }
    } else if (error.request) {
      console.log("No response from the server.");
    } else {
      console.log("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default authAxiosInstance;

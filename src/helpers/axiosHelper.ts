import axios from "axios";

export const handleAxiosError = (error: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log("Error response:", error.response?.data, error.response?.data.message);
      return error.response?.data.message || "Something went wrong";
    } else {
      return "An unexpected error occurred. Please try again later.";
    }
  }

  return null;
};

import { createContext, ReactNode, useEffect, useState } from "react";
import authAxiosInstance from "../utils/authAxios";
import axios from "axios";
import useSessionStorage from "../hooks/useSessionStorage";
import { redirect, useNavigate } from "react-router";
import PathEnum from "../constant/pathsEnum";
import isValidToken from "../utils/tokenValidator";
import useIsEmployeeRoute from "../hooks/useIsEmployeeRoute";
import ISigninInputs from "../type/ISigninInputs";
import ISignupInputs from "../type/ISignupInputs";
import RolesEnum from "../constant/rolesEnum";

interface IAuthContextProps {
  children: ReactNode;
}

interface IAuthProvider {
  errorMessage: string;
  isAuth: boolean;
  isLoading: boolean;
  setErrorMessage: (value: string) => void;
  signin: (value: ISigninInputs) => Promise<void>;
  signup: (value: ISignupInputs) => Promise<void>;
  signout: () => void;
}

interface ILoginResponse {
  accessToken: string;
}

const AuthProvider = createContext<IAuthProvider | null>(null);

const AuthContext = ({ children }: IAuthContextProps) => {
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuth, setAuth] = useState(false);
  const navigate = useNavigate();
  const isEmployee = useIsEmployeeRoute();

  const { storedValue, setValue, removeValue } = useSessionStorage({
    key: "accessToken",
    initialValue: "",
  });

  const onSuccess = () => {
    setAuth(true);
    navigate(PathEnum.DASHBOARD);
  };

  const signin = async ({ username, email, password }: ISigninInputs) => {
    try {
      setLoading(true);
      const res = await authAxiosInstance.post<ILoginResponse>(
        isEmployee ? PathEnum.LOGIN_EMPLOYEE : PathEnum.LOGIN,
        {
          username,
          email,
          password,
        }
      );

      setValue(res.data.accessToken);
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      } else {
        setErrorMessage("Unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: ISignupInputs) => {
    try {
      const formData = new FormData();

      // Append form data only if they exist
      if (data.first_name) formData.append("first_name", data.first_name);
      if (data.last_name) formData.append("last_name", data.last_name);
      formData.append("business_type", data.business_type);
      if (data.nic) formData.append("nic", data.nic);
      if (data.contact) formData.append("contact", data.contact);
      formData.append("email", data.email);
      formData.append("full_address", JSON.stringify(data.full_address));
      formData.append("password", data.password);
      if (data.brn) formData.append("brn", data.brn);
      formData.append("createdBy", RolesEnum.CUSTOMER);

      if (data.brFile) {
        if (data.brFile instanceof FileList) {
          formData.append("brFile", data.brFile[0]);
        } else {
          formData.append("brFile", data.brFile);
        }
      }

      // Make a POST request to the register endpoint
      const response = await authAxiosInstance.post(
        PathEnum.REGISTER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("User registered successfully", response.data);
      onSuccess();
    } catch (error) {
      console.error("Signup failed", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log("Error response:", error.response?.data);
          setErrorMessage(
            error.response?.data.message || "Something went wrong"
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  const signout = () => {
    removeValue();
    setAuth(false);
    redirect(PathEnum.LOGIN);
  };

  useEffect(() => {
    if (isValidToken(storedValue)) {
      navigate(PathEnum.DASHBOARD);
      setAuth(true);
    }
  }, [storedValue]);

  useEffect(() => {
    setErrorMessage("");
  }, []);

  return (
    <AuthProvider.Provider
      value={{
        errorMessage,
        isAuth,
        isLoading,
        setErrorMessage,
        signin,
        signup,
        signout,
      }}
    >
      {children}
    </AuthProvider.Provider>
  );
};

export { AuthContext, AuthProvider };

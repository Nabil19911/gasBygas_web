import { createContext, ReactNode, useEffect, useState } from "react";
import authAxiosInstance from "../utils/authAxios";
import axios from "axios";
import useSessionStorage from "../hooks/useSessionStorage";
import { redirect, useNavigate } from "react-router";
import Path from "../constant/pathEnum";
import isValidToken from "../utils/tokenValidator";
import useIsEmployeeRoute from "../hooks/useIsEmployeeRoute";
import ISigninInputs from "../type/ISigninInputs";
import ISignupInputs from "../type/ISignupInputs";

interface IAuthContextProps {
  children: ReactNode;
}

interface IAuthProvider {
  errorMessage: string;
  isAuth: boolean;
  isLoading: boolean;
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

  const signin = async ({ username, password }: ISigninInputs) => {
    try {
      setLoading(true);
      const res = await authAxiosInstance.post<ILoginResponse>(
        isEmployee ? Path.LOGIN_EMPLOYEE : Path.LOGIN,
        {
          username,
          password,
        }
      );

      setValue(res.data.accessToken);
      setAuth(true);
      navigate(Path.DASHBOARD);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          setErrorMessage("Invalid username or password. Please try again.");
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
      // Send user data excluding the brfile
      const userData = {
        first_name: data.first_name,
        last_name: data.last_name,
        business_type: data.business_type,
        nic: data.nic,
        contact: data.contact,
        email: data.email,
        full_address: data.full_address,
        password: data.password,
        brn: data.brn,
        username: data.username,
      };

      const response = await authAxiosInstance.post(Path.REGISTER, userData);

      // TODO: handle document upload

      // // If brfile exists, upload it separately
      // if (data.brfile) {
      //   const formData = new FormData();
      //   formData.append("brfile", data.brfile);

      //   // Upload the brfile to a separate endpoint
      //   const fileResponse = await axios.post("/api/upload-brfile", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   });

      //   console.log("BR File uploaded successfully", fileResponse.data);
      // }

      console.log("User registered successfully", response.data);
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Signup failed", error);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  };

  const signout = () => {
    removeValue();
    setAuth(false);
    redirect(Path.LOGIN);
  };

  useEffect(() => {
    if (isValidToken(storedValue)) {
      navigate(Path.DASHBOARD);
      setAuth(true);
    }
  }, [storedValue]);

  return (
    <AuthProvider.Provider
      value={{ errorMessage, isAuth, isLoading, signin, signup, signout }}
    >
      {children}
    </AuthProvider.Provider>
  );
};

export { AuthContext, AuthProvider };

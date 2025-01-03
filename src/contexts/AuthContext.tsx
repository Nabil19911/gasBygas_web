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
    console.log(data);
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

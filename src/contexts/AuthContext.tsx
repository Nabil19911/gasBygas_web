import { createContext, ReactNode, useEffect, useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router";
import GeneralEnum from "../constant/generalEnum";
import PathsEnum from "../constant/pathsEnum";
import { handleAxiosError } from "../helpers/axiosHelper";
import useIsEmployeeRoute from "../hooks/useIsEmployeeRoute";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  fetchCustomerProfileDetail,
  fetchEmployeeProfileDetail,
} from "../store/silces/profileSlice";
import { useAppDispatch } from "../store/store";
import ISigninInputs from "../type/ISigninInputs";
import ICustomer from "../type/ICustomer";
import authAxiosInstance from "../utils/authAxios";
import isValidToken from "../utils/tokenValidator";

interface IAuthContextProps {
  children: ReactNode;
}

interface IAuthProvider {
  errorMessage: string;
  isAuth?: boolean;
  isLoading: boolean;
  setErrorMessage: (value: string) => void;
  signin: (value: ISigninInputs) => Promise<void>;
  signup: (value: ICustomer) => Promise<void>;
  signout: () => void;
}

interface ILoginResponse {
  accessToken: string;
}

const AuthProvider = createContext<IAuthProvider | null>(null);

const AuthContext = ({ children }: IAuthContextProps) => {
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuth, setAuth] = useState<boolean>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = useIsEmployeeRoute();

  const dispatch = useAppDispatch();

  const { storedValue, setValue, removeValue } = useLocalStorage({
    key: GeneralEnum.ACCESSTOKEN,
    initialValue: "",
  });

  const onSuccess = (token: string, value: string) => {
    setAuth(true);
    setValue(token);
    navigate(PathsEnum.DASHBOARD);
    setLoading(false);
    getUserProfile(value);
  };

  const getUserProfile = async (value: string) => {
    if (isEmployee) {
      await dispatch(fetchEmployeeProfileDetail(value));
    } else {
      await dispatch(fetchCustomerProfileDetail(value));
    }
  };

  const signin = async ({ username, email, password }: ISigninInputs) => {
    try {
      setLoading(true);
      const res = await authAxiosInstance.post<ILoginResponse>(
        isEmployee ? PathsEnum.LOGIN_EMPLOYEE : PathsEnum.LOGIN,
        {
          username,
          email,
          password,
        }
      );

      const value = isEmployee ? username : email;
      onSuccess(res.data.accessToken, value!);
    } catch (error) {
      console.error("Signin failed", error);
      setErrorMessage(
        handleAxiosError(error as string) || "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: ICustomer) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append form data only if they exist
      formData.append("business_type", data.business_type);
      formData.append("contact", data.contact);
      formData.append("email", data.email);
      formData.append("full_address", JSON.stringify(data.full_address));
      formData.append("password", data.password);
      if (data.individual_details) {
        formData.append(
          "individual_details",
          JSON.stringify(data.individual_details)
        );
      }

      if (data.organization_details) {
        if (data.business_registration_certification_path) {
          let value: File | string | undefined;
          if (
            data.business_registration_certification_path instanceof FileList
          ) {
            value = data.business_registration_certification_path[0];
          } else {
            value = data.business_registration_certification_path;
          }
          // Append the file only if it's defined
          if (value) {
            formData.append("business_registration_certification_path", value);
          }
        }

        formData.append(
          "organization_details",
          JSON.stringify(data.organization_details)
        );
      }

      // Make a POST request to the register endpoint
      const response = await authAxiosInstance.post(
        PathsEnum.REGISTER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("User registered successfully", response.data);
      onSuccess(response.data.accessToken, data.email);
    } catch (error) {
      console.error("Signup failed", error);
      setErrorMessage(
        handleAxiosError(error as string) || "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const signout = () => {
    removeValue();
    setAuth(false);
    redirect(PathsEnum.LOGIN);
  };

  useEffect(() => {
    if (!isValidToken(storedValue)) {
      signout();
    } else {
      navigate(location.pathname);
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

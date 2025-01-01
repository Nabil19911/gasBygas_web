import { createContext, ReactNode, useState } from "react";
import authAxiosInstance from "../utils/authAxios";
import axios from "axios";
import useSessionStorage from "../hooks/useSessionStorage";

interface IAuthContextProps {
  children: ReactNode;
}

interface IAuthProvider {
  errorMessage: string;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface ILoginResponse {
  accessToken: string;
}

const AuthProvider = createContext<IAuthProvider | null>(null);

const AuthContext = ({ children }: IAuthContextProps) => {
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setValue, removeValue } = useSessionStorage({
    key: "accessToken",
    initialValue: "",
  });

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const res = await authAxiosInstance.post<ILoginResponse>("/login", {
        username,
        password,
      });

      setValue(res.data.accessToken);
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

  const logout = () => {
    removeValue();
  };

  return (
    <AuthProvider.Provider value={{ errorMessage, isLoading, login, logout }}>
      {children}
    </AuthProvider.Provider>
  );
};

export { AuthContext, AuthProvider };

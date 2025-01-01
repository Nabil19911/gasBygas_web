import { useContext } from "react";
import { AuthProvider } from "../contexts/AuthContext";

const useAuth = () => {
  const context = useContext(AuthProvider);

  if (!context) throw new Error("Auth context must be use inside AuthProvider");

  return context;
};

export default useAuth;

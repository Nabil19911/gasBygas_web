import { Navigate, Outlet } from "react-router";
import Path from "../constant/pathEnum";
import useAuth from "../hooks/useAuth";

const AuthGuard = () => {
  const { isAuth } = useAuth();

  return isAuth ? <Outlet /> : <Navigate to={Path.LOGIN} replace />;
};

export default AuthGuard;

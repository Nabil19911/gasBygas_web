import { Navigate, Outlet } from "react-router";
import PathEnum from "../constant/pathsEnum";
import useAuth from "../hooks/useAuth";

const AuthGuard = () => {
  const { isAuth } = useAuth();

  return isAuth ? <Outlet /> : <Navigate to={PathEnum.LOGIN} replace />;
};

export default AuthGuard;

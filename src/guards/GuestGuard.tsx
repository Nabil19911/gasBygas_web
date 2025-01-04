import { Navigate, Outlet } from "react-router";
import PathEnum from "../constant/pathsEnum";
import useAuth from "../hooks/useAuth";

const GuestGuard = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to={PathEnum.DASHBOARD} replace /> : <Outlet />;
};

export default GuestGuard;

import { Navigate, Outlet } from "react-router";
import PathsEnum from "../constant/pathsEnum";
import useAuth from "../hooks/useAuth";

const GuestGuard = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to={PathsEnum.DASHBOARD} replace /> : <Outlet />;
};

export default GuestGuard;

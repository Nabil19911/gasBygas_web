import { Navigate, Outlet } from "react-router";
import Path from "../constant/pathEnum";
import useAuth from "../hooks/useAuth";

const GuestGuard = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to={Path.DASHBOARD} replace /> : <Outlet />;
};

export default GuestGuard;

import { ReactNode } from "react";
import { Navigate } from "react-router";
import PathsEnum from "../constant/pathsEnum";
import useAuth from "../hooks/useAuth";

interface IAuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: IAuthGuardProps) => {
  const { isAuth } = useAuth();

  return isAuth ? children : <Navigate to={PathsEnum.LOGIN} replace />;
};

export default AuthGuard;

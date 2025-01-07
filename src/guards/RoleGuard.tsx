import { ReactNode } from "react";
import { Navigate } from "react-router";
import PathsEnum from "../constant/pathsEnum";
import useAuth from "../hooks/useAuth";
import { getUserProfile } from "../store/selectors/profileSelector";
import { useAppSelector } from "../store/store";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { isAuth } = useAuth();
  const profileData = useAppSelector(getUserProfile);

  if (!isAuth) {
    return <Navigate to={PathsEnum.LOGIN} replace />;
  }

  if (profileData.data && !allowedRoles.includes(profileData.data.role)) {
    return <Navigate to={PathsEnum.DASHBOARD} replace />;
  }

  return children;
};

export default RoleGuard;

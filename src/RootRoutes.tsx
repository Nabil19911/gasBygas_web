import { Navigate, Route, Routes } from "react-router";
import PathEnum from "./constant/pathsEnum";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
import { lazy } from "react";

const Login = lazy(() => import("./components/Auth/Login"));
const Register = lazy(() => import("./components/Auth/Register"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const NotFound = lazy(() => import("./components/NotFound"));

function RootRoutes() {
  return (
    <Routes>
      <Route element={<GuestGuard />}>
        <Route path={PathEnum.ROOT} element={<AuthLayout />}>
          <Route index element={<Navigate to={PathEnum.LOGIN} replace />} />
          <Route path={PathEnum.REGISTER} element={<Register />} />
          <Route path={PathEnum.LOGIN_EMPLOYEE} element={<Login />} />
          <Route path={PathEnum.LOGIN} element={<Login />} />
        </Route>
      </Route>

      <Route element={<AuthGuard />}>
        <Route path={PathEnum.DASHBOARD} element={<DashboardLayout />}></Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RootRoutes;

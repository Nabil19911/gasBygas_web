import { Navigate, Route, Routes } from "react-router";
import Path from "./constant/pathEnum";
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
        <Route path={Path.ROOT} element={<AuthLayout />}>
          <Route index element={<Navigate to={Path.LOGIN} replace />} />
          <Route path={Path.REGISTER} element={<Register />} />
          <Route path={Path.LOGIN_EMPLOYEE} element={<Login />} />
          <Route path={Path.LOGIN} element={<Login />} />
        </Route>
      </Route>

      <Route element={<AuthGuard />}>
        <Route path={Path.DASHBOARD} element={<DashboardLayout />}></Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RootRoutes;

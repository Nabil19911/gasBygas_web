import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import PathsEnum from "./constant/pathsEnum";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";

const DashboardManager = lazy(() => import("./components/Dashboard"));
const Employee = lazy(() => import("./components/Employee"));
const Customer = lazy(() => import("./components/Customer"));
const Outlet = lazy(() => import("./components/Outlet"));
const Report = lazy(() => import("./components/Report"));
const Profile = lazy(() => import("./components/Profile"));
const Login = lazy(() => import("./components/Auth/Login"));
const Register = lazy(() => import("./components/Auth/Register"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const NotFound = lazy(() => import("./components/NotFound"));

function RootRoutes() {
  return (
    <Routes>
      <Route element={<GuestGuard />}>
        <Route path={PathsEnum.ROOT} element={<AuthLayout />}>
          <Route index element={<Navigate to={PathsEnum.LOGIN} replace />} />
          <Route path={PathsEnum.REGISTER} element={<Register />} />
          <Route path={PathsEnum.LOGIN_EMPLOYEE} element={<Login />} />
          <Route path={PathsEnum.LOGIN} element={<Login />} />
        </Route>
      </Route>

      <Route
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route path={PathsEnum.DASHBOARD} element={<DashboardManager />} />
        <Route path={PathsEnum.EMPLOYEE} element={<Employee />} />
        <Route path={PathsEnum.CUSTOMER} element={<Customer />} />
        <Route path={PathsEnum.OUTLET} element={<Outlet />} />
        <Route path={PathsEnum.REPORT} element={<Report />} />
        <Route path={PathsEnum.PROFILE} element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RootRoutes;

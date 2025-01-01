import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div>
      <div></div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;

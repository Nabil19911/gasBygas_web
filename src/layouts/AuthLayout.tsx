import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Switch } from "../common/ui-components/form-fields";
import PathsEnum from "../constant/pathsEnum";
import useIsEmployeeRoute from "../hooks/useIsEmployeeRoute";

const AuthLayout = () => {
  const [isLogin, setLogin] = useState(false);
  const navigate = useNavigate();
  const isEmployee = useIsEmployeeRoute();

  const handleToggle = () => {
    setLogin(!isLogin);
    navigate(isLogin ? PathsEnum.LOGIN : PathsEnum.REGISTER);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-white">
        <img src="\assets\logo_Gas_by_Gas.png" className="w-2/4" />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 overflow-auto">
        <div className="w-full max-w-md">
          {!isEmployee && (
            <div className="mb-8">
              <Switch
                isChecked={isLogin}
                onToggle={handleToggle}
                labelLeft="Login"
                labelRight="Register"
              />
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

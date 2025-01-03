import { useLocation } from "react-router";

const useIsEmployeeRoute = () => {
  const { pathname } = useLocation();
  return pathname.includes("employee");
};

export default useIsEmployeeRoute;

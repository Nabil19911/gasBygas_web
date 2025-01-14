import Customer from "../../common/dashboard/customer";
import Dispatcher from "../../common/dashboard/employee/dispatcher";
import OutletManager from "../../common/dashboard/employee/outletManager";
import SystemAdmin from "../../common/dashboard/employee/systemAdmin";
import RolesEnum from "../../constant/rolesEnum";
import { getUserProfile } from "../../store/selectors/profileSelector";
import { useAppSelector } from "../../store/store";
import ICustomerProfile from "../../type/ICustomerProfile";

const DashboardManager = () => {
  const profile = useAppSelector(getUserProfile);

  switch (profile.data?.role) {
    case RolesEnum.CUSTOMER:
      return <Customer profile={profile.data as ICustomerProfile} />;
    case RolesEnum.ADMIN:
      return <SystemAdmin />;
    case RolesEnum.BRANCH_MANAGER:
      return <OutletManager />;
    case RolesEnum.DISPATCH_OFFICER:
      return <Dispatcher />;

    default:
      return <></>;
  }
};

export default DashboardManager;

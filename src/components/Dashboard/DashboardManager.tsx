import Customer from "../../common/dashboard/customer";
import RolesEnum from "../../constant/rolesEnum";
import { getUserProfile } from "../../store/selectors/profileSelector";
import { useAppSelector } from "../../store/store";
import ICustomerProfile from "../../type/ICustomerProfile";

const DashboardManager = () => {
  const profile = useAppSelector(getUserProfile);

  switch (profile.data?.role) {
    case RolesEnum.CUSTOMER:
      return <Customer profile={profile.data as ICustomerProfile} />;

    default:
      return <></>;
  }
};

export default DashboardManager;

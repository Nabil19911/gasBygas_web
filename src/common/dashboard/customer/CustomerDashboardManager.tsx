import CustomerTypeEnum from "../../../constant/customerTypeEnum";
import ICustomerProfile from "../../../type/ICustomerProfile";
import Individual from "./individual";
import Organization from "./organization";

interface ICustomerProps {
  profile: ICustomerProfile;
}

const CustomerDashboardManager = ({ profile }: ICustomerProps) => {
  switch (profile.business_type) {
    case CustomerTypeEnum.ORGANIZATION:
      return <Organization profile={profile} />;
    case CustomerTypeEnum.INDIVIDUAL:
      return <Individual profile={profile} />;
    default:
      return <></>;
  }
};

export default CustomerDashboardManager;

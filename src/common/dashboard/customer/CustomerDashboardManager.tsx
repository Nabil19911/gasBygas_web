import CustomerTypeEnum from "../../../constant/customerTypeEnum";
import ICustomer from "../../../type/ICustomer";
import Individual from "./individual";
import Organization from "./organization";

interface ICustomerProps {
  profile: ICustomer;
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

import CustomerTypeEnum from "../constant/customerTypeEnum";
import RolesEnum from "../constant/rolesEnum";
import ICustomer from "../type/ICustomer";
import IEmployee from "../type/IEmployee";

export const getProfileName = (profile: Partial<ICustomer & IEmployee>) => {
  if (profile?.role === RolesEnum.CUSTOMER) {
    if (profile?.business_type === CustomerTypeEnum.INDIVIDUAL) {
      return profile?.individual_details?.first_name;
    }
    return profile?.organization_details?.business_name;
  }

  return profile?.first_name;
};

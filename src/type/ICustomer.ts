import ActiveStatus from "../constant/activeStatusOptions";
import RolesEnum from "../constant/rolesEnum";
import IFullAddress from "./IFullAddress";
import IIndividualDetails from "./IIndividualDetails";
import IOrganizationDetails from "./IOrganizationDetails";

interface ICustomer {
  business_type: string;
  createdAt: string;
  email: string;
  password: string;
  confirm_password?: string;
  contact: string;
  full_address: IFullAddress;
  status: ActiveStatus;
  created_by: string;
  role?: RolesEnum;
  individual_details?: IIndividualDetails;
  business_registration_certification_path?: File;
  organization_details?: IOrganizationDetails;
  _id?: string;
}

export default ICustomer;

import IFullAddress from "./IFullAddress";
import IIndividualDetails from "./IIndividualDetails";
import IOrganizationDetails from "./IOrganizationDetails";

interface ISignupInputs {
  business_type: string;
  email: string;
  password: string;
  confirm_password?: string;
  contact: string;
  full_address: IFullAddress;
  status: string;
  created_by: string;
  individual_details: IIndividualDetails;
  business_registration_certification_path: File;
  organization_details: IOrganizationDetails;
}

export default ISignupInputs;

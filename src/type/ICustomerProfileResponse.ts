import RolesEnum from "../constant/rolesEnum";

interface ICustomerProfileResponse {
  brFile: string;
  brn: string;
  business_type: string;
  contact: string;
  createdBy: string;
  email: string;
  role: RolesEnum;
  full_address: {
    district: string;
    post_code: string;
    address: string;
  };
  is_approved: boolean;
}

export default ICustomerProfileResponse;

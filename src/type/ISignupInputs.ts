interface ISignupInputs {
  first_name?: string;
  last_name?: string;
  username?: string;
  business_type: string;
  nic: string;
  brFile: File;
  brn: string;
  contact: string;
  email: string;
  full_address: { district: string; post_code: string; address: string };
  password: string;
  confirm_password: string;
}

export default ISignupInputs;

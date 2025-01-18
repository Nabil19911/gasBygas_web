import ActiveStatus from "../constant/activeStatusOptions";
import RolesEnum from "../constant/rolesEnum";

type IEmployee = {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  contact: string;
  role: RolesEnum;
  outlet: string;
  status: ActiveStatus;
};

export default IEmployee;

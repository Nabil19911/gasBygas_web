import ActiveStatus from "../constant/activeStatusOptions";
import RolesEnum from "../constant/rolesEnum";
import { IOutlet } from "./IOutlet";

type IEmployee = {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  contact: string;
  role: RolesEnum;
  outlet: IOutlet;
  status: ActiveStatus;
};

export default IEmployee;

import ActiveStatus from "../constant/activeStatusOptions";
import GasTypeEnum from "../constant/gasTypesEnum";
import IFullAddress from "./IFullAddress";

export interface ICylinderStock {
  type: GasTypeEnum;
  currentStock: number;
  minimumThreshold: number;
  maximumCapacity: number;
}

export interface IOutlet {
  name: string;
  status: ActiveStatus;
  branch_code: string;
  contact: string;
  email: string;
  full_address: IFullAddress;
  cylinders_stock: ICylinderStock[];
  _id?: string;
}

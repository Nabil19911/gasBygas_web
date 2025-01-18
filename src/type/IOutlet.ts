import ActiveStatus from "../constant/activeStatusOptions";
import GasTypeEnum from "../constant/gasTypesEnum";
import IFullAddress from "./IFullAddress";

export interface ICylinderStock {
  type: GasTypeEnum;
  currentStock: number;
  minimumThreshold: number;
  maximumCapacity: number;
}

export interface IStock {
  cylinders: ICylinderStock[];
}

export interface IOutlet {
  name: string;
  status: ActiveStatus;
  branch_code: string;
  contact: string;
  email: string;
  // location: string;
  full_address: IFullAddress;
  stock: IStock;
  _id?: string;
}

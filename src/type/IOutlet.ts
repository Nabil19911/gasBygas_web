import ActiveStatus from "../constant/activeStatusOptions";
import GasTypeEnum from "../constant/gasTypesEnum";
import IFullAddress from "./IFullAddress";

export interface ICylinderStock {
  type: GasTypeEnum;
  currentStock: number;
  minimumThreshold: number;
  maximumCapacity: number;
  incomingStock?: number;
}

export interface IGasRequest {
  active_until?: Date;
  is_allowed?: boolean;
  allowed_qty?: number;
}

export interface IOutlet {
  name?: string;
  status: ActiveStatus;
  branch_code: string;
  contact: string;
  email: string;
  full_address: IFullAddress;
  cylinders_stock: ICylinderStock[];
  gas_request?: IGasRequest;
  _id?: string;
}

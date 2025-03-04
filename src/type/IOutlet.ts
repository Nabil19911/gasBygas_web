import ActiveStatus from "../constant/activeStatusOptions";
import IFullAddress from "./IFullAddress";
import IGasType from "./IGasType";

export interface ICylinderStock {
  type: IGasType | string;
  currentStock: number;
  minimumThreshold: number;
  maximumCapacity: number;
  incomingStock?: number;
}

export interface IGasRequest {
  active_until?: Date;
  is_allowed?: boolean;
  allowed_qty?: number;
  scheduleId?: string;
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

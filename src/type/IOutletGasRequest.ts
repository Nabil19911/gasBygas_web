import DeliveryStatusEnum from "../constant/DeliveryStatusEnum";
import GasRequestTypeEnum from "../constant/gasRequestTypeEnum";
import GasTypeEnum from "../constant/gasTypesEnum";
import RequestStatusEnum from "../constant/requestStatusEnum";
import { ISchedule } from "./IDeliveryRequest";

export interface IApprovedGas {
  type?: GasTypeEnum;
  requestType?: GasRequestTypeEnum;
  gasQuantity?: number;
}

export interface IHeadOfficeApproval {
  status?: RequestStatusEnum;
  approvedBy?: string;
  approvedDate?: Date;
  approvedGas?: IApprovedGas[];
  comment?: string;
}

export interface ICylinder {
  returned?: boolean;
  cylinderQuantity?: number;
}

export interface IGas {
  type?: GasTypeEnum;
  cylinder?: ICylinder;
  gasQuantity?: number;
}

export interface IOutletGasRequest {
  _id?: string;
  scheduleId: ISchedule | string;
  outletId: string;
  status?: DeliveryStatusEnum;
  headOfficeApproval?: IHeadOfficeApproval;
  gas?: IGas[];
  comments?: string;
}

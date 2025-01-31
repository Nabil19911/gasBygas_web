import DeliveryStatusEnum from "../constant/DeliveryStatusEnum";
import GasTypeEnum from "../constant/gasTypesEnum";
import RequestStatusEnum from "../constant/requestStatusEnum";
import { ISchedule } from "./IDeliveryRequest";
import { IOutlet } from "./IOutlet";

export interface IHeadOfficeApproval {
  status?: RequestStatusEnum;
  approvedBy?: string;
  approvedDate?: Date;
  comment?: string;
}

export interface IGas {
  type?: GasTypeEnum;
  gasQuantity?: number;
  approvedGasQuantity?: number;
}

export interface IOutletGasRequest {
  _id?: string;
  scheduleId: ISchedule | string;
  outletId: IOutlet | string;
  status?: DeliveryStatusEnum;
  headOfficeApproval?: IHeadOfficeApproval;
  gas?: IGas[];
  comments?: string;
}

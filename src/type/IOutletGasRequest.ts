import DeliveryStatusEnum from "../constant/DeliveryStatusEnum";
import RequestStatusEnum from "../constant/requestStatusEnum";
import { ISchedule } from "./IDeliveryRequest";
import IGasType from "./IGasType";
import { IOutlet } from "./IOutlet";

export interface IHeadOfficeApproval {
  status?: RequestStatusEnum;
  approvedBy?: string;
  approvedDate?: Date;
  comment?: string;
}

export interface IGas {
  type?: IGasType | string;
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

import DeliveryStatusEnum from "../constant/DeliveryStatusEnum";
import GasRequestTypeEnum from "../constant/gasRequestTypeEnum";
import PaymentMethodEnum from "../constant/paymentMethodEnum";
import PaymentStatusEnum from "../constant/paymentStatusEnum";
import RequestStatusEnum from "../constant/requestStatusEnum";
import RolesEnum from "../constant/rolesEnum";
import { TProfileData } from "../store/silces/profileSlice";
import ICustomer from "./ICustomer";
import { ISchedule } from "./IDeliveryRequest";
import IGasType from "./IGasType";
import { IOutlet } from "./IOutlet";
import IToken from "./IToken";

interface IGas {
  type?: IGasType | string;
  requestType?: GasRequestTypeEnum;
  isCylinderReturned?: boolean;
  gasQuantity?: number;
  approvedQuantity?: number;
}

export interface IReallocateGasRequest {
  is_reallocated?: boolean;
  toSheduleId?: ISchedule | string;
  fromScheduleId?: ISchedule | string;
  comments?: string;
}

export interface IPayment {
  status?: PaymentStatusEnum;
  totalAmount?: number;
  method?: PaymentMethodEnum;
  paymentDate?: Date;
}

export interface IIndividualCustomerGasRequest {
  _id?: string;
  userId: ICustomer | string;
  outletId: IOutlet | string;
  tokenId: IToken | string;
  scheduleId: ISchedule | string;
  gas: IGas;
  reallocateGasRequest?: IReallocateGasRequest;
  payment?: IPayment;
  comment?: string;
  createdBy: RolesEnum;
  createdAt?: Date;
  updatedAt?: Date;
  status?: DeliveryStatusEnum;
  isWaiting?: boolean;
}

interface IHeadOfficeApproval {
  status?: RequestStatusEnum;
  approvedBy?: string;
  date?: Date;
  comment?: string;
}

interface IGasRefillRequest {
  gasQuantity?: number;
  approvedQuantity?: number;
}

interface IGasNewRequest extends IGasRefillRequest {
  isCylinderReturned?: boolean;
  cylinderReturnedCount?: number;
}

interface IOrganizationGas {
  type?: IGasType | string;
  gasRefillRequests?: IGasRefillRequest;
  gasNewRequests?: IGasNewRequest;
}

export interface IOrganizationGasRequest {
  _id?: string;
  userId: TProfileData | string;
  tokenId?: string;
  deliveryDate?: Date;
  gas?: IOrganizationGas[];
  payment?: IPayment;
  headOfficeApproval?: IHeadOfficeApproval;
  comment?: string;
  createdBy: RolesEnum;
  createdAt?: Date;
  updatedAt?: Date;
  status?: DeliveryStatusEnum;
}

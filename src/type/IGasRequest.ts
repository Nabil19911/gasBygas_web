import GasRequestTypeEnum from "../constant/gasRequestTypeEnum";
import GasTypeEnum from "../constant/gasTypesEnum";
import PaymentMethodEnum from "../constant/paymentMethodEnum";
import PaymentStatusEnum from "../constant/paymentStatusEnum";
import RequestStatusEnum from "../constant/requestStatusEnum";
import RolesEnum from "../constant/rolesEnum";
import { TProfileData } from "../store/silces/profileSlice";

interface IGas {
  type?: GasTypeEnum;
  requestType?: GasRequestTypeEnum;
  isCylinderReturned?: boolean;
  gasQuantity?: number;
  approvedQuantity?: number;
}

interface IReallocateGasRequest {
  is_reallocated?: boolean;
  toSheduleId?: string;
  comments?: string;
}

interface IPayment {
  status?: PaymentStatusEnum;
  totalAmount?: number;
  method?: PaymentMethodEnum;
  paymentDate?: Date;
}

export interface IIndividualCustomerGasRequest {
  _id?: string;
  userId: string;
  outletId: string;
  tokenId: string;
  scheduleId: string;
  gas: IGas;
  reallocateGasRequest?: IReallocateGasRequest;
  payment?: IPayment;
  comment?: string;
  createdBy: RolesEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IHeadOfficeApproval {
  status?: RequestStatusEnum;
  approvedBy?: string;
  date?: Date;
  comment?: string;
}

export interface IOrganizationGasRequest {
  _id?: string;
  userId: TProfileData | string;
  tokenId?: string;
  deliveryDate?: Date;
  gas?: IGas[];
  payment?: IPayment;
  headOfficeApproval?: IHeadOfficeApproval;
  comment?: string;
  createdBy: RolesEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

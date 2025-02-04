import GasRequestTypeEnum from "../constant/gasRequestTypeEnum";
import GasTypeEnum from "../constant/gasTypesEnum";
import PaymentMethodEnum from "../constant/paymentMethodEnum";
import PaymentStatusEnum from "../constant/paymentStatusEnum";
import RequestStatusEnum from "../constant/requestStatusEnum";
import RolesEnum from "../constant/rolesEnum";
import ICustomer from "./ICustomer";
import { ISchedule } from "./IDeliveryRequest";
import { IOutlet } from "./IOutlet";
import IToken from "./IToken";

interface IGas {
  type: GasTypeEnum;
  requestType: GasRequestTypeEnum;
  isCylinderReturned: boolean;
  gasQuantity: number;
  comments?: string;
}

interface IGasRequest {
  _id?: string;
  userId: ICustomer | string;
  outletId: IOutlet | string;
  tokenId?: IToken | string;
  scheduleId?: ISchedule | string;
  gas: {
    individual?: IGas;
    organization?: Array<IGas>;
  };

  payment: {
    status: PaymentStatusEnum;
    totalAmount: number;
    method: PaymentMethodEnum;
    requestDate: string;
  };

  outletManagerApproval: {
    status: RequestStatusEnum;
    approvedBy?: string;
    date?: string;
  };

  comments?: string;
  createdBy: RolesEnum;
}

export default IGasRequest;

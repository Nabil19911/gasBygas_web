import GasRequestTypeEnum from "../constant/gasRequestTypeEnum";
import GasTypeEnum from "../constant/gasTypesEnum";
import PaymentMethodEnum from "../constant/paymentMethodEnum";
import PaymentStatusEnum from "../constant/paymentStatusEnum";
import RequestStatusEnum from "../constant/requestStatusEnum";
import RolesEnum from "../constant/rolesEnum";

interface ICylinder {
  returned: {
    type: Boolean;
    required: false;
    default: false;
  };
  cylinderQuantity: {
    type: Number;
    required: false;
  };
}

interface IGasRequest {
  userId: string;
  outletId: string;
  tokenId?: string;
  scheduledId?: string;
  gas: {
    individual?: {
      type: GasTypeEnum;
      requestType: GasRequestTypeEnum;
      cylinder?: ICylinder;
      gasQuantity: number;
      comments?: string;
    };
    organization?: Array<{
      type: GasTypeEnum;
      requestType: GasRequestTypeEnum;
      cylinder?: ICylinder;
      gasQuantity: number;
      comments?: string;
    }>;
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
  createdBy: {
    type: RolesEnum;
    userId: string;
  };
}

export default IGasRequest;

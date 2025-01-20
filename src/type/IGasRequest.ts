import GasRequestTypeEnum from "../constant/gasRequestTypeEnum";
import GasTypeEnum from "../constant/gasTypesEnum";
import PaymentMethodEnum from "../constant/paymentMethodEnum";
import PaymentStatusEnum from "../constant/paymentStatusEnum";
import RequestStatusEnum from "../constant/requestStatusEnum";
import RolesEnum from "../constant/rolesEnum";

interface IGasRequest {
  userId: string;
  outletId: string;
  requestType: GasRequestTypeEnum;
  tokenId?: string;
  gas: {
    individual?: {
      type: GasTypeEnum;
      gasQuantity: number;
      comments?: string;
    };
    organization?: Array<{
      type: GasTypeEnum;
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
  approval: {
    outletManagerApproval: {
      status: RequestStatusEnum;
      approvedBy?: string;
      date?: string;
    };
    dispatcherApproval: {
      status: RequestStatusEnum;
      approvedBy?: string;
      date?: string;
    };
  };
  comments?: string;
  scheduledSlot?: {
    slotId: string;
    date: string;
    timeRange: string;
  };
  slotReassignmentHistory?: Array<{
    reassignedBy: string;
    fromSlot: string;
    toSlot: string;
    date: string;
  }>;
  createdBy: {
    type: RolesEnum;
    userId: string;
  };
}

export default IGasRequest;

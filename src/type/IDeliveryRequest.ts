import DeliveryStatusEnum from "../constant/DeliveryStatusEnum";
import GasTypeEnum from "../constant/gasTypesEnum";

export interface IGas {
  type: GasTypeEnum;
  gasQuantity: number;
}

export interface IRequestOutlet {
  outletId: string;
  gas: IGas[];
}

export interface ISchedule {
  _id?: string;
  status?: DeliveryStatusEnum;
  deliveryDate?: string;
  outlets: IRequestOutlet[];
  comment?: string;
}

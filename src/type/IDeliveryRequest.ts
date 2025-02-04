import DeliveryStatusEnum from "../constant/DeliveryStatusEnum";
import DistrictsEnum from "../constant/districtsEnum";

export interface ISchedule {
  _id?: string;
  status?: DeliveryStatusEnum;
  deliveryDate?: string;
  district: DistrictsEnum;
  comment?: string;
}

import ActiveStatus from "../constant/activeStatusOptions";
import DistrictsEnum from "../constant/districtsEnum";

export interface ISchedule {
  _id?: string;
  status?: ActiveStatus;
  deliveryDate?: string;
  district: DistrictsEnum;
  comment?: string;
}

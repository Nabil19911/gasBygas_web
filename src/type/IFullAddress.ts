import DistrictsEnum from "../constant/districtsEnum";

interface IFullAddress {
  district: DistrictsEnum;
  post_code: string;
  address: string;
}

export default IFullAddress;

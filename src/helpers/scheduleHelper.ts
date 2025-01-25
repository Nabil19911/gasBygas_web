import GasTypeEnum from "../constant/gasTypesEnum";
import { IOutlet } from "../type/IOutlet";

export const getOutletStock = (
  selected: string,
  type: GasTypeEnum,
  exsitingOutlets: IOutlet[]
) => {
  if (!selected || !type || !exsitingOutlets) {
    return null;
  }

  const selectedOutlet = exsitingOutlets.find((item) => item._id === selected);

  if (!selectedOutlet || !selectedOutlet.stock?.cylinders) {
    return null;
  }

  return (
    selectedOutlet.stock.cylinders.find((cylinder) => cylinder.type === type) ||
    null
  );
};

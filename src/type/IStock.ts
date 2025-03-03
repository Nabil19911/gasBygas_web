import IGasType from "./IGasType";

export interface IStockItem {
  currentStock: number;
  gasType: IGasType[] | string; // The gas type should be one of the enum values
  reservedStock?: number;
  minimumThreshold?: number;
  maximumCapacity?: number;
}

interface IStock {
  _id?: string;
  stock: IStockItem[]; // Array of stock items
}

export default IStock;

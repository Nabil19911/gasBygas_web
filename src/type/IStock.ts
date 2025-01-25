import GasTypeEnum from "../constant/gasTypesEnum";


export interface IStockItem {
  currentStock: number;
  gasType: GasTypeEnum; // The gas type should be one of the enum values
  reservedStock?: number;
  minimumThreshold?: number;
  maximumCapacity?: number;
}

interface IStock {
  _id?: string;
  stock: IStockItem[]; // Array of stock items
}

export default IStock;

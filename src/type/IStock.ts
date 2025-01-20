interface IStock {
  _id?: string;
  currentStock: number;
  outgoingStock: number;
  minimumThreshold: number;
  maximumCapacity: number;
}

export default IStock;

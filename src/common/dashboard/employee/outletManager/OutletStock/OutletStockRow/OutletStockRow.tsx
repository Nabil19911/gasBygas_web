import IGasType from "../../../../../../type/IGasType";
import { ICylinderStock } from "../../../../../../type/IOutlet";
import Table from "../../../../../ui-components/table";

interface IOutletStockRowProps {
  item: ICylinderStock;
}
const OutletStockRow = ({ item }: IOutletStockRowProps) => {
  return (
    <Table.Row>
      <Table.Cell>{(item.type as IGasType).name}</Table.Cell>
      <Table.Cell>{item.currentStock}</Table.Cell>
      <Table.Cell>{item.minimumThreshold}</Table.Cell>
      <Table.Cell>{item.maximumCapacity}</Table.Cell>
      <Table.Cell>{item.incomingStock}</Table.Cell>
      <Table.Cell>LKR {(item.type as IGasType).price}</Table.Cell>
    </Table.Row>
  );
};

export default OutletStockRow;

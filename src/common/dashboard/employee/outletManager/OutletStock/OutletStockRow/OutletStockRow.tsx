import IGasType from "../../../../../../type/IGasType";
import Table from "../../../../../ui-components/table";

interface IOutletStockRowProps {
  item: any;
}
const OutletStockRow = ({ item }: IOutletStockRowProps) => {
  console.log(item)
  return (
    <Table.Row>
      <Table.Cell>{(item.type as IGasType).name}</Table.Cell>
      <Table.Cell>{item.currentStock}</Table.Cell>
      <Table.Cell>{item.minimumThreshold}</Table.Cell>
      <Table.Cell>{item.maximumCapacity}</Table.Cell>
      <Table.Cell>LKR {(item.type as IGasType).price}</Table.Cell>
    </Table.Row>
  );
};

export default OutletStockRow;

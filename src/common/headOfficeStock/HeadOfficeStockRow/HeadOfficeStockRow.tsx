import IGasType from "../../../type/IGasType";
import Table from "../../ui-components/table";

interface HeadOfficeStockRowProps {
  item: { gasType: IGasType; currentStock: number, reservedStock: number };
}

const HeadOfficeStockRow = ({ item }: HeadOfficeStockRowProps) => {
  return (
    <Table.Row>
      <Table.Cell>{item.gasType.name}</Table.Cell>
      <Table.Cell>{item.reservedStock}</Table.Cell>
      <Table.Cell>{item.currentStock}</Table.Cell>
      <Table.Cell>LKR {item.gasType.price}</Table.Cell>
    </Table.Row>
  );
};

export default HeadOfficeStockRow;

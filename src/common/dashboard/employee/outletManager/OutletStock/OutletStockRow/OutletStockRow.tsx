import Table from "../../../../../ui-components/table";

interface IOutletStockRowProps {
  item: any;
}
const OutletStockRow = ({ item }: IOutletStockRowProps) => {
  return (
    <Table.Row>
      <Table.Cell>{item.type}</Table.Cell>
      <Table.Cell>{item.currentStock}</Table.Cell>
      <Table.Cell>{item.minimumThreshold}</Table.Cell>
      <Table.Cell>{item.maximumCapacity}</Table.Cell>
    </Table.Row>
  );
};

export default OutletStockRow;

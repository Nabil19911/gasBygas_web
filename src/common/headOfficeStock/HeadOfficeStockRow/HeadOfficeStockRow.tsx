import Table from "../../ui-components/table";

interface HeadOfficeStockRowProps {
  item: { gasType: string; currentStock: number };
}

const HeadOfficeStockRow = ({ item }: HeadOfficeStockRowProps) => {
  return (
    <Table.Row>
      <Table.Cell>{item.gasType}</Table.Cell>
      <Table.Cell>{item.currentStock}</Table.Cell>
    </Table.Row>
  );
};

export default HeadOfficeStockRow;

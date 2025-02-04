import { TrendingUp } from "lucide-react";
import { useCallback } from "react";
import IStock from "../../type/IStock";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { Button } from "../ui-components/form-fields";
import Table from "../ui-components/table";
import HeadOfficeStockRow from "./HeadOfficeStockRow";

interface IHeadOfficeStockProps {
  openModal: () => void;
  stock: IStock;
}

const HeadOfficeStock = ({ stock, openModal }: IHeadOfficeStockProps) => {
  const renderStockRows = useCallback(() => {
    return stock?.stock?.map((item) => (
      <HeadOfficeStockRow key={item.gasType} item={item} />
    ));
  }, [stock]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            <TrendingUp className="mr-2 h-5 w-5" />
            Stock Level
          </div>
          <Button size="sm" onClick={openModal}>
            Update Stock
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <Table.Header>
            <Table.Column>Gas Type</Table.Column>
            <Table.Column>Current Stock</Table.Column>
          </Table.Header>
          <Table.Body>{renderStockRows()}</Table.Body>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HeadOfficeStock;

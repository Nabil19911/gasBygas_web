import { Route } from "lucide-react";
import { useCallback } from "react";
import { getUserProfile } from "../../../../../store/selectors/profileSelector";
import { useAppSelector } from "../../../../../store/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import Table from "../../../../ui-components/table";
import OutletStockRow from "./OutletStockRow";

const OutletStock = () => {
  const { data: profile } = useAppSelector(getUserProfile);

  const renderStockRows = useCallback(() => {
    return profile?.outlet?.cylinders_stock.map((item) => (
      <OutletStockRow key={item.type} item={item} />
    ));
  }, [profile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            <Route className="mr-2 h-5 w-5" />
            Stock
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <Table.Header>
            <Table.Column>Type</Table.Column>
            <Table.Column>Current Stock</Table.Column>
            <Table.Column>Minimum Threshold</Table.Column>
            <Table.Column>Maximum Capacity</Table.Column>
          </Table.Header>
          <Table.Body>{renderStockRows()}</Table.Body>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OutletStock;

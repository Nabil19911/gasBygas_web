import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { Button } from "../ui-components/form-fields";
import IStock from "../../type/IStock";

interface IHeadOfficeStockProps {
  openModal: () => void;
  stock: IStock;
}

const HeadOfficeStock = ({ stock, openModal }: IHeadOfficeStockProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            <TrendingUp className="mr-2 h-5 w-5" />
            Stock level
          </div>
          <Button size="sm" className="flex-initial w-1/4" onClick={openModal}>
            Update Stock
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {stock?.stock?.map((item) => {
            return (
              <li key={item.gasType} className="flex justify-between items-center">
                <p className="font-medium">{item.gasType}</p>
                <span className="text-sm text-gray-500">
                  {item.currentStock}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default HeadOfficeStock;

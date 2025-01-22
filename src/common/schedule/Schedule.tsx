import { Route, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { Button } from "../ui-components/form-fields";

interface IScheduleProps {
  openModal: () => void;
}

const Schedule = ({ openModal }: IScheduleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            <Route className="mr-2 h-5 w-5" />
            Schedule
          </div>
          <Button className="flex-initial w-1/4" onClick={openModal}>
            Schedule
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex justify-between items-center">
            <p className="font-medium">In Stock</p>
            {/* <span className="text-sm text-gray-500">{stock.currentStock}</span> */}
          </li>
          <li className="flex justify-between items-center">
            <p className="font-medium">minimum Threshold</p>
            <span className="text-sm text-gray-500">
              {/* {stock.minimumThreshold} */}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <p className="font-medium">maximum Capacity</p>
            <span className="text-sm text-gray-500">
              {/* {stock.maximumCapacity} */}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <p className="font-medium">Reserved Stock</p>
            {/* <span className="text-sm text-gray-500">{stock.outgoingStock}</span> */}
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default Schedule;

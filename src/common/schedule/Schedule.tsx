import { Route } from "lucide-react";
import PathsEnum from "../../constant/pathsEnum";
import { ISchedule } from "../../type/IDeliveryRequest";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { Button, Link } from "../ui-components/form-fields";
import DeliveryStatusEnum from "../../constant/DeliveryStatusEnum";

interface IScheduleProps {
  schedules: ISchedule[];
  openModal: () => void;
}

const Schedule = ({ schedules, openModal }: IScheduleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            <Route className="mr-2 h-5 w-5" />
            Schedule
          </div>
          <Button size="sm" className="flex-initial w-1/4" onClick={openModal}>
            Schedule
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {schedules
            .filter(
              (item) =>
                item.status === DeliveryStatusEnum.Pending ||
                item.status === DeliveryStatusEnum.OutForDelivery
            )
            .map((schedule) => {
              if (!schedule) return "No Schedule";
              return (
                <li
                  key={schedule!._id!}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-500">
                      {schedule.district}
                    </p>
                    <p className="text-sm text-gray-500">{schedule.status}</p>
                    <p className="text-sm">
                      {new Date(schedule.deliveryDate!)?.toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    size="sm"
                    className="cursor-pointer"
                    href={`${PathsEnum.SCHEDULE}/${schedule._id}`}
                  >
                    View
                  </Link>
                </li>
              );
            })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Schedule;

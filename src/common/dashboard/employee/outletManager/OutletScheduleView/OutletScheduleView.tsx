import { Route } from "lucide-react";
import useGetSchedule from "../../../../../hooks/useGetSchedule";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import { useAppSelector } from "../../../../../store/store";
import { getUserProfile } from "../../../../../store/selectors/profileSelector";

const OutletScheduleView = () => {
  const { data: schedules } = useGetSchedule();
  const { data: profile } = useAppSelector(getUserProfile);
  const outletDistrict = profile?.outlet?.full_address.district;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            <Route className="mr-2 h-5 w-5" />
            Schedule View
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {schedules
            .filter((schedule) => schedule.district === outletDistrict)
            .map((schedule) => {
              if (!schedule) return "No Schedule";
              return (
                <li
                  key={schedule!._id!}
                  className="flex justify-between items-center"
                >
                  <p className="font-medium">
                    {new Date(schedule.deliveryDate!)?.toLocaleDateString()}
                  </p>
                  <span className="text-sm text-gray-500">
                    {schedule.district}
                  </span>
                  <p className="font-medium">{schedule.status}</p>
                </li>
              );
            })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default OutletScheduleView;

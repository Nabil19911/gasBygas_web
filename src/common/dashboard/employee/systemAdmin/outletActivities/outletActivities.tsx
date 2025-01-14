import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";

const activities = [
  { outlet: "Outlet A", action: "Stock Updated", time: "2 hours ago" },
  { outlet: "Outlet B", action: "New Request", time: "4 hours ago" },
  { outlet: "Outlet C", action: "Payment Received", time: "6 hours ago" },
  { outlet: "Outlet D", action: "Stock Low Alert", time: "8 hours ago" },
];

const OutletActivities = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Recent Outlet Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{activity.outlet}</p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default OutletActivities;

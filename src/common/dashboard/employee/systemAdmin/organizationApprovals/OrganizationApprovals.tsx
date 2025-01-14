import { ClipboardCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import { Button } from "../../../../ui-components/form-fields";

const pendingApprovals = [
  { name: "Organization A", type: "Gas Station", date: "2023-05-01" },
  { name: "Organization B", type: "Distributor", date: "2023-05-02" },
  { name: "Organization C", type: "Retailer", date: "2023-05-03" },
];

const OrganizationApprovals = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Pending Organization Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {pendingApprovals.map((org, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{org.name}</p>
                <p className="text-sm text-gray-500">{org.type}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{org.date}</span>
                <Button>Review</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default OrganizationApprovals;

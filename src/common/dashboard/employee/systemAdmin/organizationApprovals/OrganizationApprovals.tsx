import { ClipboardCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import { Button } from "../../../../ui-components/form-fields";
import useGetCustomers from "../../../../../hooks/useGetCustomers";
import { useMemo } from "react";
import CustomerTypeEnum from "../../../../../constant/customerTypeEnum";
import RequestStatusEnum from "../../../../../constant/requestStatusEnum";

const OrganizationApprovals = () => {
  const { data: customers } = useGetCustomers();
  const organization = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.business_type === CustomerTypeEnum.ORGANIZATION &&
        customer.organization_details?.approval_status ===
          RequestStatusEnum.PENDING
    );
  }, [customers]);

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
          {organization.map((org, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {org.organization_details?.business_name}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(org.createdAt).toLocaleDateString("en-CA")}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 text-nowrap">
                  {org.organization_details?.approval_status}
                </span>
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

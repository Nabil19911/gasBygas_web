import { ClipboardCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import useGetAllOrganizationGasRequest from "../../hooks/useGetAllOrganizationGasRequest";
import { Link } from "../ui-components/form-fields";
import PathsEnum from "../../constant/pathsEnum";
import { TProfileData } from "../../store/silces/profileSlice";

const OrganizationGasRequest = () => {
  const { data: organizationGasRequests } = useGetAllOrganizationGasRequest();

  console.log({ organizationGasRequests });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Organization Gas Requests Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {organizationGasRequests.map((outletGasRequest) => {
            return (
              <li
                key={outletGasRequest._id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {
                      (outletGasRequest?.userId as TProfileData)
                        .organization_details?.business_name
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {outletGasRequest.headOfficeApproval?.status!}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    size="sm"
                    className="cursor-pointer"
                    href={`${PathsEnum.ORGANIZATION_GAS_REQUEST_APPROVAL}/${outletGasRequest._id}`}
                  >
                    Review
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default OrganizationGasRequest;

import useGetAllOutletGasRequest from "../../hooks/useGetAllOutletGasRequest";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { ClipboardCheck } from "lucide-react";
import { Link } from "../ui-components/form-fields";
import PathsEnum from "../../constant/pathsEnum";
import { ISchedule } from "../../type/IDeliveryRequest";
import { IOutlet } from "../../type/IOutlet";

const OutletGasRequestView = () => {
  const { data: outletGasRequests } = useGetAllOutletGasRequest();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Pending Outlet gas request Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {outletGasRequests.map((outletGasRequest) => {
            return (
              <li
                key={outletGasRequest._id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {outletGasRequest.headOfficeApproval?.status!}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      (outletGasRequest?.scheduleId! as ISchedule)
                        ?.deliveryDate || ""
                    ).toLocaleDateString("en-CA")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(outletGasRequest?.scheduleId! as ISchedule)?.district}
                  </p>
                </div>
                <div>
                  <p>{(outletGasRequest?.outletId! as IOutlet)?.name}</p>
                  <p className="text-sm text-gray-500">
                    {(outletGasRequest?.outletId! as IOutlet)?.branch_code}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(outletGasRequest?.scheduleId! as ISchedule)?.status}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    size="sm"
                    className="cursor-pointer"
                    href={`${PathsEnum.OUTLET_GAS_REQUEST_APPROVAL}/${outletGasRequest._id}`}
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

export default OutletGasRequestView;

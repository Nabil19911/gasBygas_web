import { ArrowDownCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import { Button } from "../../../../ui-components/form-fields";
import OutletGasRequestModal from "../../../../modal/OutletGasRequestModal";
import { useCallback, useState } from "react";
import { useAppSelector } from "../../../../../store/store";
import { getUserProfile } from "../../../../../store/selectors/profileSelector";
import useGetOutletGasRequestById from "../../../../../hooks/useGetOutletGasRequestById";
import { ISchedule } from "../../../../../type/IDeliveryRequest";

const GasRequest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: employee } = useAppSelector(getUserProfile);
  const outletId = employee?.outlet?._id!;
  const { data: outletGasRequests, fetchData } = useGetOutletGasRequestById({
    outletId,
  });

  const renderOutletGasRequest = useCallback(() => {
    return outletGasRequests.map((outletGasRequest) => {
      return (
        <li
          key={outletGasRequest!._id + outletId}
          className="flex justify-between items-center"
        >
          <p>Request</p>
          <p>
            {new Date(
              (outletGasRequest.scheduleId as ISchedule).deliveryDate!
            ).toDateString()}
          </p>
          <p className="font-medium">
            {outletGasRequest.headOfficeApproval?.status}
          </p>
        </li>
      );
    });
  }, [outletGasRequests, outletId]);

  return (
    <Card>
      <OutletGasRequestModal
        employee={employee}
        isOpen={isOpen}
        fetchData={fetchData}
        closeModal={() => setIsOpen(false)}
      />
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            {/* <Route className="mr-2 h-5 w-5" /> */}
            <ArrowDownCircle className="mr-2 h-5 w-5" />
            Gas Request
          </div>
          <Button
            size="sm"
            className="flex-initial w-1/4"
            onClick={() => setIsOpen(true)}
          >
            Request Gas
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">{renderOutletGasRequest()}</ul>
      </CardContent>
    </Card>
  );
};

export default GasRequest;

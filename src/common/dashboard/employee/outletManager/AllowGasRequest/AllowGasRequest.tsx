import { ArrowDownCircle } from "lucide-react";
import { useState } from "react";
import PathsEnum from "../../../../../constant/pathsEnum";
import useGetIndividualGasRequest from "../../../../../hooks/useGetIndividualGasRequest";
import { getUserProfile } from "../../../../../store/selectors/profileSelector";
import { useAppSelector } from "../../../../../store/store";
import ICustomer from "../../../../../type/ICustomer";
import { ISchedule } from "../../../../../type/IDeliveryRequest";
import OutletGasRequestAllowModal from "../../../../modal/OutletGasRequestAllowModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import { Button, Link } from "../../../../ui-components/form-fields";
import Banner from "../../../../ui-components/banner";
import useFetch from "../../../../../hooks/useFetch";
import { IOutlet } from "../../../../../type/IOutlet";

const AllowGasRequest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: profile } = useAppSelector(getUserProfile);
  const { data: activeGasRequests } = useGetIndividualGasRequest({
    outletId: profile?.outlet?._id,
  });

  const { data: outlet } = useFetch<IOutlet>({
    url: `/outlet/${profile?.outlet?._id}`,
    initialLoad: true,
  });

  const activeGas = outlet?.gas_request;

  return (
    <Card>
      <OutletGasRequestAllowModal
        outlet={outlet}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            <ArrowDownCircle className="mr-2 h-5 w-5" />
            Gas Request
          </div>
          <Button
            size="sm"
            className="flex-initial w-1/4"
            // disabled={activeGas?.is_allowed}
            onClick={() => setIsOpen(true)}
          >
            Allowed Gas Request
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeGas?.is_allowed && (
          <Banner type="info">{`Gas Request is active until ${new Date(
            activeGas?.active_until ?? ""
          ).toLocaleDateString()}`}</Banner>
        )}
        <ul className="space-y-4">
          {activeGasRequests.map((activeGasRequest) => {
            return (
              <li
                key={activeGasRequest._id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-500">
                    {
                      (activeGasRequest?.userId as unknown as ICustomer)
                        ?.individual_details?.first_name
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeGasRequest?.payment?.status}
                  </p>
                  <p className="text-sm">
                    {new Date(
                      (activeGasRequest?.scheduleId as unknown as ISchedule)
                        ?.deliveryDate || ""
                    ).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  size="sm"
                  className="cursor-pointer"
                  href={`${PathsEnum.TOKEN}/${activeGasRequest._id}`}
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

export default AllowGasRequest;

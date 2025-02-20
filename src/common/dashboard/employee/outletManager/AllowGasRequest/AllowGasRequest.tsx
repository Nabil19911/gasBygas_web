import { ArrowDownCircle } from "lucide-react";
import { useState } from "react";
import DeliveryStatusEnum from "../../../../../constant/DeliveryStatusEnum";
import RequestStatusEnum from "../../../../../constant/requestStatusEnum";
import useFetch from "../../../../../hooks/useFetch";
import useGetIndividualGasRequest from "../../../../../hooks/useGetIndividualGasRequest";
import useGetOutletGasRequestById from "../../../../../hooks/useGetOutletGasRequestById";
import { getUserProfile } from "../../../../../store/selectors/profileSelector";
import { useAppSelector } from "../../../../../store/store";
import ICustomer from "../../../../../type/ICustomer";
import { ISchedule } from "../../../../../type/IDeliveryRequest";
import { IOutlet } from "../../../../../type/IOutlet";
import OutletGasRequestAllowModal from "../../../../modal/OutletGasRequestAllowModal";
import ReallocateModal from "../../../../modal/ReallocateModal/ReallocateModal";
import Banner from "../../../../ui-components/banner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import { Button } from "../../../../ui-components/form-fields";

const AllowGasRequest = () => {
  const [isAllowModalOpen, setIsAllowModalOpen] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>();
  const { data: profile } = useAppSelector(getUserProfile);
  const { data: activeGasRequests, fetchData } = useGetIndividualGasRequest({
    outletId: profile?.outlet?._id,
  });

  const { data: outletGasRequests } = useGetOutletGasRequestById({
    outletId: profile?.outlet?._id!,
  });

  const { data: outlet } = useFetch<IOutlet>({
    url: `/outlet/${profile?.outlet?._id}`,
    initialLoad: true,
  });

  const activeGas = outlet?.gas_request;

  return (
    <Card>
      <ReallocateModal
        closeModal={() => setIsViewModal(false)}
        isOpen={isViewModal}
        selectedId={selectedId}
        fetchData={() => fetchData({ outletId: profile?.outlet?._id })}
        selectedScheduleId={selectedScheduleId}
      />
      <OutletGasRequestAllowModal
        outlet={outlet}
        isOpen={isAllowModalOpen}
        closeModal={() => setIsAllowModalOpen(false)}
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
            disabled={outletGasRequests.some(
              (item) =>
                item.headOfficeApproval?.status !== RequestStatusEnum.APPROVED
            )}
            onClick={() => setIsAllowModalOpen(true)}
          >
            Allowed Gas Request
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeGas?.is_allowed && activeGas?.active_until && (
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
                      (activeGasRequest?.userId as ICustomer)
                        ?.individual_details?.first_name
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeGasRequest?.payment?.status}
                  </p>
                  <p className="text-sm">
                    {new Date(
                      (activeGasRequest?.scheduleId as ISchedule)
                        ?.deliveryDate || ""
                    ).toLocaleDateString()}
                  </p>
                  {activeGasRequest.reallocateGasRequest?.is_reallocated && (
                    <p>
                      Reallocated{" "}
                      {
                        (
                          activeGasRequest?.reallocateGasRequest
                            ?.toSheduleId as ISchedule
                        ).deliveryDate
                      }
                    </p>
                  )}
                </div>
                <div>
                  {(activeGasRequest?.scheduleId as ISchedule)?.status ===
                    DeliveryStatusEnum.Cancelled && (
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedId(activeGasRequest?._id!);
                        setSelectedScheduleId(
                          (activeGasRequest?.scheduleId as ISchedule)?._id
                        );
                        setIsViewModal(true);
                      }}
                    >
                      Reallocate
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AllowGasRequest;

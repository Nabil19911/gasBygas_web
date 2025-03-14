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
import IToken from "../../../../../type/IToken";
import GasRequestCancelModal from "../../../../modal/GasRequestCancelModal";
import OutletGasRequestAllowModal from "../../../../modal/OutletGasRequestAllowModal";
import ReallocateCustomerModal from "../../../../modal/ReallocateCustomerModal";
import Banner from "../../../../ui-components/banner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import { Button } from "../../../../ui-components/form-fields";
import ReallocateScheduleModal from "../../../../modal/ReallocateScheduleModal";
import useGetSchedule from "../../../../../hooks/useGetSchedule";

const AllowGasRequest = () => {
  const [isAllowModalOpen, setIsAllowModalOpen] = useState(false);
  const [isReallocateSchedule, setReallocateSchedule] = useState(false);
  const [isReallocateCustomerModal, setIsReallocateCustomerModal] =
    useState(false);
  const [isCancelModal, setIsCancelModal] = useState(false);

  const [currentCustomerId, setCurrentCustomerId] = useState<string>();
  const [activeGasRequestId, setActiveGasRequestId] = useState<string>();
  const { data: profile } = useAppSelector(getUserProfile);
  const { data: activeGasRequests, fetchData } = useGetIndividualGasRequest({
    outletId: profile?.outlet?._id,
  });

  const { data: schedules } = useGetSchedule();

  const { data: outletGasRequests } = useGetOutletGasRequestById({
    outletId: profile?.outlet?._id!,
  });

  const { data: outlet, getNewData: fetchNewOutlet } = useFetch<IOutlet>({
    url: `/outlet/${profile?.outlet?._id}`,
    initialLoad: true,
  });

  const isAllowRequestToOutlet = outlet?.gas_request;

  const filteredDistrictSchedules = schedules.filter(
    (item) => item.district === profile?.full_address?.district
  );

  const isCustomerReallocationEnabled =
    activeGasRequests.filter((activeGasRequest) => activeGasRequest.isWaiting)
      .length > 0;

  const isScheduleCanceled =
    (outletGasRequests?.scheduleId as ISchedule)?.status ===
    DeliveryStatusEnum.Cancelled;

  return (
    <Card>
      <GasRequestCancelModal
        activeGasRequestId={activeGasRequestId!}
        isOpen={isCancelModal}
        closeModal={() => setIsCancelModal(false)}
      />
      <ReallocateScheduleModal
        isOpen={isReallocateSchedule}
        activeGasRequestIds={activeGasRequests.map((active) => active?._id!)}
        selectedScheduleId={(outletGasRequests?.scheduleId as ISchedule)?._id}
        closeModal={() => setReallocateSchedule(false)}
        fetchData={() => fetchData({ outletId: profile?.outlet?._id })}
      />
      <ReallocateCustomerModal
        closeModal={() => setIsReallocateCustomerModal(false)}
        isOpen={isReallocateCustomerModal}
        activeGasRequests={activeGasRequests}
        currentCustomerId={currentCustomerId!}
        fetchData={() => fetchData({ outletId: profile?.outlet?._id })}
      />
      <OutletGasRequestAllowModal
        outlet={outlet}
        isOpen={isAllowModalOpen}
        closeModal={() => setIsAllowModalOpen(false)}
        fetchData={() => fetchNewOutlet()}
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
            disabled={
              outletGasRequests?.headOfficeApproval?.status !==
              RequestStatusEnum.APPROVED
            }
            onClick={() => setIsAllowModalOpen(true)}
          >
            Allowed Gas Request
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isScheduleCanceled && (
          <>
            <Button
              size="sm"
              className="my-2"
              onClick={() => setReallocateSchedule(true)}
            >
              Reallocate Gas Request
            </Button>
            <Banner type="warning">Gas Schedule Cancelled</Banner>
          </>
        )}
        {outletGasRequests?.headOfficeApproval?.status ===
          RequestStatusEnum.APPROVED &&
          !isScheduleCanceled &&
          isAllowRequestToOutlet?.is_allowed &&
          isAllowRequestToOutlet?.active_until && (
            <Banner type="info">{`Gas Request is active until ${new Date(
              isAllowRequestToOutlet?.active_until ?? ""
            ).toLocaleDateString()}`}</Banner>
          )}
        <ul className="space-y-4">
          {activeGasRequests
            .filter(
              (activeGasRequest) =>
                activeGasRequest.tokenId &&
                activeGasRequest.status !== DeliveryStatusEnum.Cancelled
            )
            .map((activeGasRequest) => {
              return (
                <li
                  key={activeGasRequest._id}
                  className="flex justify-between items-center p-2 space-x-4"
                  style={{
                    border:
                      activeGasRequest.payment?.status === "OVERDUE"
                        ? "1px solid red"
                        : "",
                  }}
                >
                  <div>
                    <p className="font-medium">
                      <span className="font-bold">Name:</span>{" "}
                      {
                        (activeGasRequest?.userId as ICustomer)
                          ?.individual_details?.first_name
                      }
                    </p>
                    <p className="text-sm  text-gray-500">
                      <span className="font-bold">Payment Status:</span>{" "}
                      {activeGasRequest?.payment?.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-bold">Delivery on:</span>{" "}
                      {new Date(
                        (activeGasRequest?.scheduleId as ISchedule)
                          ?.deliveryDate || ""
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-bold">Token:</span>{" "}
                      {(activeGasRequest?.tokenId as IToken)?.token || ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-bold">Token Active Until:</span>{" "}
                      {new Date(
                        (activeGasRequest?.tokenId as IToken)?.expiryDate || ""
                      ).toLocaleDateString()}
                    </p>
                    {activeGasRequest.reallocateGasRequest?.is_reallocated && (
                      <p>
                        <span className="font-bold text-gray-500">
                          Reallocated to:
                        </span>{" "}
                        {
                          (
                            activeGasRequest?.reallocateGasRequest
                              ?.toSheduleId as ISchedule
                          ).deliveryDate
                        }
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {isCustomerReallocationEnabled && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsReallocateCustomerModal(true);
                          setCurrentCustomerId(
                            (activeGasRequest?.userId as ICustomer)?._id
                          );
                        }}
                      >
                        Reallocate token
                      </Button>
                    )}
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600"
                      size="sm"
                      onClick={() => {
                        setIsCancelModal(true);
                        setActiveGasRequestId(activeGasRequest._id);
                      }}
                    >
                      Cancel
                    </Button>
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

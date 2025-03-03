import { ArrowDownCircle } from "lucide-react";
import { useEffect, useState } from "react";
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
import ReallocateScheduleModal from "../../../../modal/ReallocateScheduleModal";
import Banner from "../../../../ui-components/banner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import { Button } from "../../../../ui-components/form-fields";
import IToken from "../../../../../type/IToken";
import ReallocateCustomerModal from "../../../../modal/ReallocateCustomerModal";

const AllowGasRequest = () => {
  const [isAllowModalOpen, setIsAllowModalOpen] = useState(false);
  const [isReallocateScheduleModal, setIsReallocateScheduleModal] =
    useState(false);
  const [isReallocateCustomerModal, setIsReallocateCustomerModal] =
    useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  // const [selectedScheduleId, setSelectedScheduleId] = useState<string>();

  const [currentCustomerId, setCurrentCustomerId] = useState<string>();
  const { data: profile } = useAppSelector(getUserProfile);
  const { data: activeGasRequests, fetchData } = useGetIndividualGasRequest({
    outletId: profile?.outlet?._id,
  });

  const { data: outletGasRequests } = useGetOutletGasRequestById({
    outletId: profile?.outlet?._id!,
  });

  const { data: outlet, getNewData: fetchNewOutlet } = useFetch<IOutlet>({
    url: `/outlet/${profile?.outlet?._id}`,
    initialLoad: true,
  });
  const scheduleId = outlet?.gas_request?.scheduleId;

  const { data: schedule, getNewData } = useFetch<ISchedule>({
    url: `/schedule/${scheduleId}`,
  });

  useEffect(() => {
    if(scheduleId){
      getNewData();
    }
  }, [scheduleId]);

  const activeGas = outlet?.gas_request;
  const isReallocationEnabled =
    schedule?.status === DeliveryStatusEnum.Cancelled;
  const isCustomerReallocationEnabled = true;

  return (
    <Card>
      <ReallocateScheduleModal
        closeModal={() => setIsReallocateScheduleModal(false)}
        isOpen={isReallocateScheduleModal}
        selectedId={selectedId}
        fetchData={() => fetchData({ outletId: profile?.outlet?._id })}
        selectedScheduleId={scheduleId}
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
              outletGasRequests.length === 0 ||
              outletGasRequests.some(
                (item) =>
                  item.headOfficeApproval?.status !== RequestStatusEnum.APPROVED
              )
            }
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
        {isReallocationEnabled && (
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              // setSelectedId(activeGasRequest?._id!);
              // setSelectedScheduleId(
              //   (activeGasRequest?.scheduleId as ISchedule)?._id
              // );
              setIsReallocateScheduleModal(true);
            }}
          >
            Reallocate to another schedule
          </Button>
        )}
        <ul className="space-y-4">
          {activeGasRequests
            .filter((activeGasRequest) => activeGasRequest.tokenId)
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
                  {isCustomerReallocationEnabled && (
                    <div className="space-y-2">
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
                      <Button
                        className="bg-red-500 text-white hover:bg-red-600"
                        size="sm"
                        onClick={() => console.log("hi")}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AllowGasRequest;

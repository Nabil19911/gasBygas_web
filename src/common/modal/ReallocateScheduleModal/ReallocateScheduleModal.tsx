import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import DeliveryStatusEnum from "../../../constant/DeliveryStatusEnum";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetSchedule from "../../../hooks/useGetSchedule";
import {
  IIndividualCustomerGasRequest,
  IReallocateGasRequest,
} from "../../../type/IGasRequest";
import ISelectOption from "../../../type/ISelectOption";
import Banner from "../../ui-components/banner";
import { Card, CardContent } from "../../ui-components/card/Card";
import { Button, Select, Textarea } from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";

interface IReallocateModalProps {
  isOpen: boolean;
  closeModal: () => void;
  activeGasRequestIds?: string[];
  selectedScheduleId?: string;
  fetchData: () => Promise<void>;
}

const ReallocateScheduleModal = ({
  isOpen,
  closeModal,
  activeGasRequestIds,
  selectedScheduleId,
  fetchData,
}: IReallocateModalProps) => {
  const { register, handleSubmit } =
    useForm<Partial<IIndividualCustomerGasRequest>>();

  const { data: schedules } = useGetSchedule();

  const {
    postData: updateGasRequest,
    isLoading,
    error,
  } = useApiFetch<
    Partial<{
      activeGasRequestIds: string[];
      reallocateGasRequest: IReallocateGasRequest;
    }>
  >({
    url: `/gas-request/individual/reallocate/`,
    options: { method: "patch" },
  });

  const scheduleOptions = useMemo(() => {
    if (schedules.length === 0) {
      return [] as ISelectOption[];
    }
    return schedules
      ?.filter((item) => item.status === DeliveryStatusEnum.Pending)
      .map((schedule) => ({
        value: schedule?._id || "",
        label: schedule?.deliveryDate || "",
      }));
  }, [schedules]);

  const onSubmit: SubmitHandler<
    Partial<IIndividualCustomerGasRequest>
  > = async (data) => {
    await updateGasRequest({
      activeGasRequestIds,
      reallocateGasRequest: {
        is_reallocated: true,
        fromScheduleId: selectedScheduleId,
        toSheduleId: data.reallocateGasRequest?.toSheduleId,
        comments: data.reallocateGasRequest?.comments,
      },
    });
    await fetchData();
    if (!isLoading && !error) {
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Reallocate Gas Request"
      className="w-lg"
    >
      {isLoading && <LoadingSpinner />}
      {error && <Banner type="error">{error}</Banner>}
      <Card className="w-full max-w-2xl mx-auto p-4">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Select
              label="Select Schedule"
              {...register("reallocateGasRequest.toSheduleId", {
                required: true,
              })}
              options={scheduleOptions}
            />
            <Textarea
              label="Comments (Optional)"
              placeholder="Enter reason for reallocation"
              {...register("reallocateGasRequest.comments")}
            />

            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
              <Button
                onClick={closeModal}
                disabled={isLoading}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Close
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ReallocateScheduleModal;

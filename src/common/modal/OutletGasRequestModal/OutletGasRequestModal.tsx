import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { deliveryStatusOptions } from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetGasTypes from "../../../hooks/useGetGasTypes";
import useGetOutletGasRequestById from "../../../hooks/useGetOutletGasRequestById";
import useGetSchedule from "../../../hooks/useGetSchedule";
import { TProfileData } from "../../../store/silces/profileSlice";
import { ISchedule } from "../../../type/IDeliveryRequest";
import { IOutletGasRequest } from "../../../type/IOutletGasRequest";
import Banner from "../../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../ui-components/card/Card";
import { Button, Select, TextInput } from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";
import DeliveryStatusEnum from "../../../constant/DeliveryStatusEnum";

interface IOutletGasRequestModalProps {
  employee?: Partial<TProfileData> | null;
  isOpen: boolean;
  closeModal: () => void;
  fetchData: ({ outletId }: { outletId: string }) => Promise<void>;
}

const OutletGasRequestModal = ({
  isOpen,
  employee,
  closeModal,
  fetchData,
}: IOutletGasRequestModalProps) => {
  const {
    isLoading: isCreateGasRequestLoading,
    error,
    postData: createGasRequest,
  } = useApiFetch<IOutletGasRequest>({
    url: "/outlet/gas-request",
  });
  const outletId = employee?.outlet?._id!;

  const { data: schedules } = useGetSchedule();

  const { data: outletGasRequests } = useGetOutletGasRequestById({
    outletId,
  });

  const scheduleOptions = useMemo(() => {
    if (!schedules) {
      return [];
    }

    const outletDistrict = employee?.outlet?.full_address.district;

    return schedules
      .filter(
        (schedule) =>
          schedule.district === outletDistrict &&
          schedule.status === DeliveryStatusEnum.Pending &&
          (outletGasRequests?.scheduleId as ISchedule)?._id !== schedule._id
      )
      .map((schedule) => ({
        label: new Date(schedule?.deliveryDate!).toISOString(),
        value: schedule?._id!,
      }));
  }, [schedules, outletGasRequests]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IOutletGasRequest>();

  const {
    data: gasTypeData,
    isLoading: isGasTypeLoading,
    error: errorInGasType,
  } = useGetGasTypes();

  const isLoading = isCreateGasRequestLoading || isGasTypeLoading;

  const onSubmit: SubmitHandler<IOutletGasRequest> = async (data) => {
    await createGasRequest({
      ...data,
      outletId,
    });
    await fetchData({ outletId });

    if (!isLoading) {
      closeModal();
    }
  };

  const hasScheduleEnabled = scheduleOptions.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Request Gas"
      className="w-lg"
    >
      {isLoading && <LoadingSpinner />}
      {error && <Banner type="error">{error}</Banner>}
      {errorInGasType && <Banner type="error">{errorInGasType}</Banner>}
      {hasScheduleEnabled && (
        <Banner type="info">Schedule is not enabled for the district</Banner>
      )}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardDescription>
            Fill in the Outlet delivery details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Delivery Date */}
            <Select
              label="Date"
              options={scheduleOptions}
              defaultValue={scheduleOptions[0]?.value}
              error={errors.status?.message}
              {...register("scheduleId", { required: "Status is required" })}
              disabled={hasScheduleEnabled}
            />

            {/* Status Selection */}
            <Select
              label="Status"
              options={deliveryStatusOptions}
              defaultValue={deliveryStatusOptions[0].value}
              disabled
              {...register("status", { required: "Status is required" })}
            />
            {gasTypeData.map((gasType, gasIndex) => {
              return (
                <div key={gasIndex} className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <p
                      {...register(`gas.${gasIndex}.type`, {
                        value: gasType?._id || "",
                      })}
                    >
                      {gasType.name}
                    </p>
                  </div>
                  <TextInput
                    label={`Request Stock`}
                    type="number"
                    disabled={hasScheduleEnabled}
                    defaultValue={0}
                    {...register(`gas.${gasIndex}.gasQuantity`, {})}
                    min={0}
                  />
                </div>
              );
            })}

            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={hasScheduleEnabled}>
                Save
              </Button>
              <Button
                type="button"
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-400"
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

export default OutletGasRequestModal;

import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import DeliveryStatusEnum from "../../../constant/DeliveryStatusEnum";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetSchedule from "../../../hooks/useGetSchedule";
import { getUserProfile } from "../../../store/selectors/profileSelector";
import { useAppSelector } from "../../../store/store";
import { IGasRequest, IOutlet } from "../../../type/IOutlet";
import ISelectOption from "../../../type/ISelectOption";
import Banner from "../../ui-components/banner";
import { Card, CardContent } from "../../ui-components/card/Card";
import {
  Button,
  Select,
  TextInput
} from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";

interface IOutletGasRequestAllowModalProps {
  isOpen: boolean;
  outlet?: IOutlet;
  closeModal: () => void;
  fetchData: () => void;
}

const OutletGasRequestAllowModal = ({
  isOpen,
  outlet,
  closeModal,
  fetchData,
}: IOutletGasRequestAllowModalProps) => {
  const [selectedSchedule, setSelectedSchedule] = useState<string>();
  const { data: profile } = useAppSelector(getUserProfile);

  const {
    isLoading: isOutletUpdateLoading,
    error,
    postData: updateOutlet,
  } = useApiFetch<IOutlet>({
    url: `/outlet/${profile?.outlet?._id}`,
    options: {
      method: "patch",
    },
  });

  const { data: schedules, isLoading: isScheduleLoading } = useGetSchedule();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IGasRequest>();

  const isLoading = isOutletUpdateLoading || isScheduleLoading;

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

  const hasFieldsDisabled = scheduleOptions.length === 0;

  useEffect(() => {
    if (hasFieldsDisabled) {
      reset();
      return;
    }
    if (outlet) {
      reset(outlet.gas_request);
      setSelectedSchedule(outlet.gas_request?.scheduleId);
    }
  }, [outlet]);

  const onSubmit: SubmitHandler<IGasRequest> = async (data) => {
    const deliveryDate =
      scheduleOptions.find((item) => item.value === selectedSchedule)?.label ||
      "";
    const activeUntil = new Date(deliveryDate);
    activeUntil.setUTCDate(activeUntil.getUTCDate() - 4);

    await updateOutlet({
      ...outlet!,
      gas_request: {
        ...data,
        is_allowed: true,
        active_until: activeUntil,
        scheduleId: selectedSchedule,
      },
    });
    await fetchData();

    if (!isLoading) {
      closeModal();
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Allow Request Gas"
      className="w-lg"
    >
      {isLoading && <LoadingSpinner />}
      {error && <Banner type="error">{error}</Banner>}
      {hasFieldsDisabled && (
        <Banner type="info">Schedule is not enable for the district</Banner>
      )}
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-5">
            <div className="flex gap-2 items-center justify-center my-4">
              <Select
                disabled={hasFieldsDisabled}
                label="Select Schedule"
                error={errors.scheduleId?.message}
                {...register("scheduleId", {
                  required: "Schedule is required Field",
                })}
                value={selectedSchedule}
                options={scheduleOptions}
                onChange={(e) => {
                  setSelectedSchedule(e.target.value);
                }}
              />
              <TextInput
                label="Quantity"
                disabled={hasFieldsDisabled}
                placeholder="QTY"
                type="number"
                error={errors.allowed_qty?.message}
                {...register("allowed_qty", {
                  required: "Quantity is required field",
                })}
              />
            </div>
            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <Button disabled={hasFieldsDisabled} type="submit">
                Save
              </Button>
              <Button
                type="button"
                onClick={() => {
                  closeModal();
                  reset();
                }}
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

export default OutletGasRequestAllowModal;

import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
  CheckboxInput,
  Select,
  TextInput,
} from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";

interface IOutletGasRequestAllowModalProps {
  isOpen: boolean;
  outlet?: IOutlet;
  closeModal: () => void;
}

const OutletGasRequestAllowModal = ({
  isOpen,
  outlet,
  closeModal,
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

  const { register, handleSubmit, reset } = useForm<IGasRequest>();

  useEffect(() => {
    if (outlet) {
      reset(outlet.gas_request);
    }
  }, [outlet]);

  const isLoading = isOutletUpdateLoading || isScheduleLoading;

  const scheduleOptions = useMemo(() => {
    if (schedules.length === 0) {
      return [] as ISelectOption[];
    }
    return schedules?.map((schedule) => ({
      value: schedule?._id || "",
      label: schedule?.deliveryDate || "",
    }));
  }, [schedules]);

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
        active_until: activeUntil,
        scheduleId: selectedSchedule,
      },
    });
    if (!isLoading) {
      closeModal();
    }
  };

  const hasFieldsDisabled = schedules.length === 0;

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
            <div className="mb-4 space-y-2">
              <Select
                disabled={hasFieldsDisabled}
                label="Select Schedule"
                {...register("scheduleId", {
                  required: true,
                })}
                options={scheduleOptions}
                onChange={(e) => {
                  setSelectedSchedule(e.target.value);
                }}
              />
              <div className="flex gap-2 items-center justify-center mt-4">
                <div>
                  <CheckboxInput
                    disabled={hasFieldsDisabled}
                    label={"Allow"}
                    id={"allow"}
                    {...register("is_allowed", {
                      required: true,
                    })}
                  />
                </div>
                <div className="flex-1">
                  <TextInput
                    disabled={hasFieldsDisabled}
                    placeholder="QTY"
                    type="number"
                    {...register("allowed_qty", {
                      required: true,
                    })}
                  />
                </div>
              </div>
            </div>
            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <Button disabled={hasFieldsDisabled} type="submit">
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

export default OutletGasRequestAllowModal;

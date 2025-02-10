import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import gasTypeOption from "../../../constant/gasTypeOptions";
import { deliveryStatusOptions } from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetSchedule from "../../../hooks/useGetSchedule";
import { TProfileData } from "../../../store/silces/profileSlice";
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

  const { data: schedules } = useGetSchedule();

  const scheduleOptions = useMemo(() => {
    if (!schedules) {
      return [];
    }

    const outletDistrict = employee?.outlet?.full_address.district;

    return schedules
      .filter((schedule) => schedule.district === outletDistrict)
      .map((schedule) => ({
        label: new Date(schedule.deliveryDate!).toISOString(),
        value: schedule._id!,
      }));
  }, [schedules]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IOutletGasRequest>();

  const isLoading = isCreateGasRequestLoading;

  const onSubmit: SubmitHandler<IOutletGasRequest> = async (data) => {
    const outletId = employee?.outlet?._id!;
    await createGasRequest({
      ...data,
      outletId,
    });
    await fetchData({ outletId });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Request Gas"
      className="w-lg"
    >
      {isLoading && <LoadingSpinner />}
      {error && <Banner type="error">{error}</Banner>}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardDescription>Fill in the delivery details below.</CardDescription>
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
            />

            {/* Status Selection */}
            <Select
              label="Status"
              options={deliveryStatusOptions}
              defaultValue={deliveryStatusOptions[0].value}
              disabled
              {...register("status", { required: "Status is required" })}
            />
            {gasTypeOption.map((gasType, gasIndex) => {
              return (
                <div key={gasIndex} className="grid grid-cols-2 gap-4">
                  <TextInput
                    label={`Gas Type ${gasIndex + 1}`}
                    disabled
                    value={gasType.value}
                    {...register(`gas.${gasIndex}.type`, {})}
                  />
                  <TextInput
                    label={`Request Stock`}
                    type="number"
                    defaultValue={0}
                    {...register(`gas.${gasIndex}.gasQuantity`, {})}
                    min={0}
                  />
                </div>
              );
            })}

            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="submit">Save</Button>
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

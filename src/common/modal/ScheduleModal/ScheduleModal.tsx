import { SubmitHandler, useForm } from "react-hook-form";
import {
  deliveryStatusOptions,
  districtsOptions,
} from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetSchedule from "../../../hooks/useGetSchedule";
import { ISchedule } from "../../../type/IDeliveryRequest";
import Banner from "../../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../ui-components/card/Card";
import {
  Button,
  DateTimePicker,
  Select,
  Textarea
} from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";

interface IScheduleModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ScheduleModal = ({ isOpen, closeModal }: IScheduleModalProps) => {
  const { fetchData, isLoading: isGetScheduleLoading } = useGetSchedule();
  const {
    postData: createSchedule,
    error,
    isLoading: isCreateScheduleLoading,
  } = useApiFetch({
    url: "/schedule/create/",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISchedule>();

  const isLoading = isCreateScheduleLoading || isGetScheduleLoading;

  const onSubmit: SubmitHandler<ISchedule> = async (data) => {
    await createSchedule(data);
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
      title="Schedule Delivery"
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
            <DateTimePicker
              label="Delivery Date"
              error={errors.deliveryDate?.message}
              {...register("deliveryDate", {
                required: "Delivery date is required",
              })}
            />

            {/* Status Selection */}
            <Select
              label="Status"
              options={deliveryStatusOptions}
              defaultValue={deliveryStatusOptions[0].value}
              disabled={true}
              error={errors.status?.message}
              {...register("status", { required: "Status is required" })}
            />

            {/* Districts Selection */}
            <Select
              label="Districts"
              options={districtsOptions}
              error={errors.district?.message}
              {...register("district", { required: "Districts is required" })}
            />

            {/* Comment */}
            <Textarea
              label="Comment"
              placeholder="Enter any additional details"
              {...register("comment")}
            />

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

export default ScheduleModal;

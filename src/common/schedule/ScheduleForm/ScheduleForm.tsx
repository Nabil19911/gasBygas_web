import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  deliveryStatusOptions,
  districtsOptions,
} from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import useFetch from "../../../hooks/useFetch";
import { ISchedule } from "../../../type/IDeliveryRequest";
import Banner from "../../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui-components/card/Card";
import {
  Button,
  DateTimePicker,
  Select,
  Textarea,
} from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import DeliveryStatusEnum from "../../../constant/DeliveryStatusEnum";

const ScheduleForm = () => {
  const navigator = useNavigate();
  const { id } = useParams();
  const {
    data: exsitingSchedule,
    isLoading: isScheduleLoading,
    error: scheduleFetchError,
    getNewData,
  } = useFetch<ISchedule>({
    url: `/schedule/${id}`,
    initialLoad: true,
  });

  const {
    postData: updateSchedule,
    error: errorCreatingSchedule,
    isLoading: isScheduleCreationLoading,
  } = useApiFetch({
    url: `/schedule/${id}`,
    options: {
      method: "put",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISchedule>({
    defaultValues: exsitingSchedule,
  });

  const isLoading = isScheduleLoading || isScheduleCreationLoading;
  const error = scheduleFetchError || errorCreatingSchedule;

  useEffect(() => {
    if (exsitingSchedule) {
      const normalizedSchedule = {
        ...exsitingSchedule,
        deliveryDate: exsitingSchedule.deliveryDate
          ? new Date(exsitingSchedule.deliveryDate).toISOString().slice(0, 16)
          : undefined,
      };
      reset(normalizedSchedule);
    }
  }, [exsitingSchedule, reset]);

  const onSubmit: SubmitHandler<ISchedule> = async (data) => {
    await updateSchedule(data);
    await getNewData();
    if (!isLoading) {
      navigator(-1);
    }
  };

  const hasDisabled =
    exsitingSchedule?.status === DeliveryStatusEnum.OutForDelivery;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            Schedule Details
          </div>
        </CardTitle>
        <CardDescription>Fill in the schedule details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isLoading && <LoadingSpinner />}
          {error && <Banner type="error">{error}</Banner>}
          {/* Delivery Date */}
          <DateTimePicker
            label="Delivery Date"
            disabled={true}
            error={errors.deliveryDate?.message}
            {...register("deliveryDate", {
              required: "Delivery date is required",
            })}
          />

          {/* Status Selection */}
          <Select
            label="Status"
            disabled={hasDisabled}
            options={deliveryStatusOptions}
            defaultValue={deliveryStatusOptions[0].value}
            error={errors.status?.message}
            {...register("status", { required: "Status is required" })}
          />

          {/* Districts Selection */}
          <Select
            label="Districts"
            disabled
            options={districtsOptions}
            error={errors.district?.message}
            {...register("district", { required: "Districts is required" })}
          />

          {/* Comment */}
          <Textarea
            label="Comment"
            disabled={hasDisabled}
            placeholder="Enter any additional details"
            {...register("comment")}
          />

          {/* Form Buttons */}
          <div className="flex justify-end space-x-4">
            <Button disabled={hasDisabled} type="submit">
              Save
            </Button>
            <Button
              type="button"
              onClick={() => navigator(-1)}
              className="bg-red-500 hover:bg-red-400"
            >
              Back
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;

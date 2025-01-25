import { useMemo } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import gasTypeOption from "../../../constant/gasTypeOptions";
import GasTypeEnum from "../../../constant/gasTypesEnum";
import { deliveryStatusOptions } from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetOutlets from "../../../hooks/useGetOutlets";
import { ISchedule, IRequestOutlet } from "../../../type/IDeliveryRequest";
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
  TextInput,
} from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";
import { getOutletStock } from "../../../helpers/scheduleHelper";

interface IScheduleModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ScheduleModal = ({ isOpen, closeModal }: IScheduleModalProps) => {
  const { data: exsitingOutlets } = useGetOutlets();
  const {
    postData: createSchedule,
    error,
    isLoading,
  } = useApiFetch({
    url: "/schedule/create/",
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ISchedule>();

  const {
    fields: outlets,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "outlets",
  });

  const outletOptions = useMemo(() => {
    if (!exsitingOutlets) {
      return [];
    }

    return exsitingOutlets.map((outlet) => ({
      label: outlet.name,
      value: outlet._id!,
    }));
  }, [exsitingOutlets]);

  const watchOutlets = watch("outlets", []);

  const selectedTypes = watchOutlets.map(
    (outlet: IRequestOutlet) => outlet.outletId
  );

  const availableOptions = (index: number) =>
    outletOptions.filter(
      (option) =>
        !selectedTypes.includes(option.value) ||
        option.value === watchOutlets[index]?.outletId
    );

  const onSubmit: SubmitHandler<ISchedule> = async (data) => {
    await createSchedule(data);
    if (!isLoading) {
      closeModal();
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
              defaultValue={deliveryStatusOptions[1].value}
              error={errors.status?.message}
              {...register("status", { required: "Status is required" })}
            />

            {/* Comment */}
            <TextInput
              label="Comment"
              placeholder="Enter any additional details"
              {...register("comment")}
            />

            {/* Outlets Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Outlets</h3>
              <div className="space-y-4">
                {outlets.map((outlet, index) => (
                  <div
                    key={outlet.id}
                    className="border rounded-md p-4 space-y-4"
                  >
                    {/* Outlet ID */}
                    <Select
                      label="Outlet"
                      options={availableOptions(index)}
                      error={errors.outlets?.[index]?.outletId?.message}
                      {...register(`outlets.${index}.outletId`, {
                        required: "Outlet is required",
                      })}
                    />

                    {/* Gas Details */}
                    <div>
                      <h4 className="font-medium">Gas Details</h4>
                      {gasTypeOption.map((_, gasIndex) => {
                        const currentStock =
                          getOutletStock(
                            watchOutlets[index]?.outletId,
                            gasTypeOption[gasIndex].value,
                            exsitingOutlets
                          )?.currentStock ?? 0;

                        const maximumCapacity =
                          getOutletStock(
                            watchOutlets[index]?.outletId,
                            gasTypeOption[gasIndex].value,
                            exsitingOutlets
                          )?.maximumCapacity ?? 0;

                        return (
                          <div
                            key={gasIndex + outlet.id}
                            className="grid grid-cols-4 gap-4"
                          >
                            {/* Gas Type */}
                            <TextInput
                              label={`Gas Type ${gasIndex + 1}`}
                              value={gasTypeOption[gasIndex].value}
                              disabled
                              {...register(
                                `outlets.${index}.gas.${gasIndex}.type`,
                                {
                                  required: "Gas type is required",
                                }
                              )}
                            />
                            <TextInput
                              label="Current Stock"
                              type="number"
                              value={currentStock || 0}
                              disabled
                            />
                            <TextInput
                              label="Maximum Capacity"
                              type="number"
                              value={maximumCapacity || 0}
                              disabled
                            />

                            {/* Gas Quantity */}
                            <TextInput
                              label="Gas Quantity"
                              type="number"
                              error={
                                errors.outlets?.[index]?.gas?.[gasIndex]
                                  ?.gasQuantity?.message
                              }
                              // disabled={currentStock >= maximumCapacity}
                              {...register(
                                `outlets.${index}.gas.${gasIndex}.gasQuantity`,
                                {
                                  required: "Gas quantity is required",
                                  valueAsNumber: true,
                                }
                              )}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Remove Outlet Button */}
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => remove(index)}
                      >
                        Remove Outlet
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Outlet Button */}
              {outlets.length < outletOptions.length && (
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    append({
                      outletId: "",
                      gas: [
                        { type: GasTypeEnum.SMALL, gasQuantity: 0 },
                        { type: GasTypeEnum.MEDIUM, gasQuantity: 0 },
                        { type: GasTypeEnum.LARGE, gasQuantity: 0 },
                        { type: GasTypeEnum.MINI, gasQuantity: 0 },
                      ],
                    })
                  }
                >
                  Add Outlet
                </Button>
              )}
            </div>

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

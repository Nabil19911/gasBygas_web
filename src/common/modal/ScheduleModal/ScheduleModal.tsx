import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
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
  MultiSelect,
  Select,
  TextInput,
} from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";
import { statusOptions } from "../../../constant/selectOptions";

interface IScheduleModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const ScheduleModal = ({ isOpen, closeModal }: IScheduleModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<any>();

  const {
    fields: outlets,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "outlets",
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    // await updateStock(data);
    // if (!isLoading) {
    //   closeModal();
    // }
  };

  const handleChange = (selectedOptions: any) => {
    console.log("Selected options:", selectedOptions);
  };
  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Schedule">
      <Card className="w-full max-w-2xl mx-auto">
        {/* {isLoading && <LoadingSpinner />} */}
        <CardHeader>
          <CardDescription>Fill in the Stock details below.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* {error && <Banner type="error">{error}</Banner>} */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DateTimePicker
              label="Select Outlets"
              {...register(`deliveryDate`, {
                required: "Current Stock is required",
              })}
            />
            <div>
              <h3 className="text-lg font-medium mb-4">Stock Management</h3>
              <div className="space-y-4">
                {outlets.map((outlet, index) => (
                  <div
                    key={outlet.id}
                    className="border rounded-md p-4 space-y-4"
                  >
                    <MultiSelect
                      options={options}
                      label="Select Outlets"
                      {...register(`stock.cylinders.${index}.currentStock`, {
                        required: "Current Stock is required",
                      })}
                    />

                    <TextInput
                      label="Minimum Threshold"
                      type="number"
                      // error={
                      //   errors?.stock?.cylinders?.[index]?.minimumThreshold
                      //     ?.message
                      // }
                      {...register(
                        `stock.cylinders.${index}.minimumThreshold`,
                        {
                          required: "Minimum Threshold is required",
                          valueAsNumber: true,
                        }
                      )}
                    />
                    <TextInput
                      label="Maximum Capacity"
                      type="number"
                      // error={
                      //   errors?.stock?.cylinders?.[index]?.maximumCapacity
                      //     ?.message
                      // }
                      {...register(`stock.cylinders.${index}.maximumCapacity`, {
                        required: "Maximum Capacity is required",
                        valueAsNumber: true,
                      })}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {/* {cylinders.length < gasTypeOption.length && ( */}
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    append({
                      // type: "" as GasTypeEnum,
                      currentStock: 0,
                      minimumThreshold: 0,
                      maximumCapacity: 0,
                    })
                  }
                >
                  Add Cylinder
                </Button>
                {/* )} */}
              </div>
              <Select
                label="Status"
                // error={errors.status?.message}
                {...register("status", { required: "Status is required" })}
                options={statusOptions}
                defaultValue={statusOptions[0].value}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="submit">Save</Button>
              <Button
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

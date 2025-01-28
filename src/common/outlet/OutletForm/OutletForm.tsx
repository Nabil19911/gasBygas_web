import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import gasTypeOption from "../../../constant/gasTypeOptions";
import GasTypeEnum from "../../../constant/gasTypesEnum";
import { statusOptions } from "../../../constant/selectOptions";
import { ICylinderStock, IOutlet } from "../../../type/IOutlet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui-components/card/Card";
import { Button, Select, TextInput } from "../../ui-components/form-fields";
import useApiFetch from "../../../hooks/useApiFetch";
import Banner from "../../ui-components/banner";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import { useNavigate } from "react-router";

const OutletForm = () => {
  const navigator = useNavigate();
  const {
    postData: createOutlet,
    error,
    isLoading,
  } = useApiFetch<IOutlet>({
    url: "/outlet/create/",
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<IOutlet>();

  const {
    fields: cylinders,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "cylinders_stock",
  });

  const watchCylinders = watch("cylinders_stock", []);

  const selectedTypes = watchCylinders.map(
    (cylinder: ICylinderStock) => cylinder?.type
  );

  const availableOptions = (index: number) =>
    gasTypeOption.filter(
      (option) =>
        !selectedTypes.includes(option.value) ||
        option.value === watchCylinders[index]?.type
    );

  const onSubmit: SubmitHandler<IOutlet> = async (data) => {
    await createOutlet(data);
    if (!isLoading) {
      navigator(-1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Outlet</CardTitle>
        <CardDescription>
          Fill in the details to create a new outlet location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isLoading && <LoadingSpinner />}
          {error && <Banner type="error">{error}</Banner>}
          <TextInput
            label="Outlet Name"
            error={errors.name?.message}
            {...register("name", { required: "Outlet Name is required" })}
          />
          <TextInput
            label="Branch Code"
            error={errors.branch_code?.message}
            {...register("branch_code", {
              required: "Outlet Name is required",
            })}
          />
          <TextInput
            label="Phone"
            error={errors.contact?.message}
            {...register("contact", {
              required: "Phone number is required",
            })}
          />
          <TextInput
            label="Email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            })}
          />
          <div className="flex flex-row gap-2">
            <TextInput
              label="District"
              error={errors.full_address?.district?.message}
              {...register("full_address.district", {
                required: "District is required",
              })}
            />
            <TextInput
              label="Post Code"
              error={errors.full_address?.post_code?.message}
              {...register("full_address.post_code", {
                required: "Post Code is required",
                validate: (value) =>
                  /^\d{5}$/.test(String(value)) ||
                  "Post Code must be exactly 5 digits",
              })}
            />
            <TextInput
              label="Address"
              error={errors.full_address?.address?.message}
              {...register("full_address.address", {
                required: "Address is required",
              })}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Stock Management</h3>
            <div className="space-y-4">
              {cylinders.map((cylinder, index) => (
                <div
                  key={cylinder.id}
                  className="border rounded-md p-4 space-y-4"
                >
                  <Select
                    label="Cylinder Type"
                    options={availableOptions(index)}
                    // error={errors?.stock?.cylinders?.[index]?.type?.message}
                    {...register(`cylinders_stock.${index}.type`, {
                      required: "Cylinder Type is required",
                    })}
                  />
                  <TextInput
                    label="Current Stock"
                    type="number"
                    // error={
                    //   errors?.stock?.cylinders?.[index]?.currentStock?.message
                    // }
                    {...register(`cylinders_stock.${index}.currentStock`, {
                      required: "Current Stock is required",
                      valueAsNumber: true,
                    })}
                  />
                  <TextInput
                    label="Minimum Threshold"
                    type="number"
                    // error={
                    //   errors?.stock?.cylinders?.[index]?.minimumThreshold
                    //     ?.message
                    // }
                    {...register(`cylinders_stock.${index}.minimumThreshold`, {
                      required: "Minimum Threshold is required",
                      valueAsNumber: true,
                    })}
                  />
                  <TextInput
                    label="Maximum Capacity"
                    type="number"
                    // error={
                    //   errors?.stock?.cylinders?.[index]?.maximumCapacity
                    //     ?.message
                    // }
                    {...register(`cylinders_stock.${index}.maximumCapacity`, {
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
              {cylinders.length < gasTypeOption.length && (
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    append({
                      type: "" as GasTypeEnum,
                      currentStock: 0,
                      minimumThreshold: 0,
                      maximumCapacity: 0,
                    })
                  }
                >
                  Add Cylinder
                </Button>
              )}
            </div>
          </div>

          <Select
            label="Status"
            error={errors.status?.message}
            {...register("status", { required: "Status is required" })}
            options={statusOptions}
            defaultValue={statusOptions[0].value}
          />

          <div className="flex justify-end space-x-4">
            <Button type="submit">Save</Button>
            <Button
              type="button"
              onClick={() => reset()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OutletForm;

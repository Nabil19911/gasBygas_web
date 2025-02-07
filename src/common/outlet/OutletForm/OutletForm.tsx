import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import gasTypeOption from "../../../constant/gasTypeOptions";
import {
  districtsOptions,
  statusOptions,
} from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetOutlets from "../../../hooks/useGetOutlets";
import { IOutlet } from "../../../type/IOutlet";
import Banner from "../../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui-components/card/Card";
import { Button, Select, TextInput } from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";

const OutletForm = () => {
  const navigator = useNavigate();
  const { fetchData } = useGetOutlets();
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
    reset,
    formState: { errors },
  } = useForm<IOutlet>();


  const onSubmit: SubmitHandler<IOutlet> = async (data) => {
    console.log(data);
    await createOutlet(data);
    await fetchData();
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
        {isLoading && <LoadingSpinner />}
        {error && <Banner type="error">{error}</Banner>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <Select
              label="District"
              error={errors.full_address?.district?.message}
              {...register("full_address.district", {
                required: "District is required",
              })}
              options={districtsOptions}
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
              {gasTypeOption.map((gasType, index) => {
                return (
                  <div key={index} className="grid grid-cols-4 gap-2">
                    <TextInput
                      label={`Gas Type ${index + 1}`}
                      disabled
                      value={gasType.value}
                      {...register(`cylinders_stock.${index}.type`, {})}
                    />
                    <TextInput
                      label="Minimum Threshold"
                      type="number"
                      error={
                        errors?.cylinders_stock?.[index]?.minimumThreshold
                          ?.message
                      }
                      {...register(
                        `cylinders_stock.${index}.minimumThreshold`,
                        {
                          required: "Minimum Threshold is required",
                          valueAsNumber: true,
                        }
                      )}
                    />
                    <TextInput
                      label="Maximum Capacity"
                      type="number"
                      error={
                        errors?.cylinders_stock?.[index]?.maximumCapacity
                          ?.message
                      }
                      {...register(`cylinders_stock.${index}.maximumCapacity`, {
                        required: "Maximum Capacity is required",
                        valueAsNumber: true,
                      })}
                    />
                    <TextInput
                      label="Current Stock"
                      type="number"
                      error={
                        errors?.cylinders_stock?.[index]?.currentStock?.message
                      }
                      {...register(`cylinders_stock.${index}.currentStock`, {
                        required: "Current Stock is required",
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                );
              })}
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

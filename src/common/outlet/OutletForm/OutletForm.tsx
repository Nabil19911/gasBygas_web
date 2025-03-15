import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  districtsOptions,
  statusOptions,
} from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetGasTypes from "../../../hooks/useGetGasTypes";
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
    isLoading: isOutletCreationLoading,
  } = useApiFetch<IOutlet>({
    url: "/outlet/create/",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IOutlet>();

  const {
    data: gasTypeData,
    isLoading: isGasTypeLoading,
    error: errorInGasType,
  } = useGetGasTypes();

  const isLoading = isOutletCreationLoading || isGasTypeLoading;

  const onSubmit: SubmitHandler<IOutlet> = async (data) => {
    await createOutlet(data);
    await fetchData();
    if (!isLoading) {
      navigator(-1);
      reset();
    }
  };

  const hasFieldDisable = gasTypeData.length === 0;

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
        {errorInGasType && <Banner type="error">{errorInGasType}</Banner>}
        {hasFieldDisable && <Banner type="info">Please add gas stock</Banner>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextInput
            label="Outlet Name"
            disabled={hasFieldDisable}
            error={errors.name?.message}
            {...register("name", { required: "Outlet Name is required" })}
          />
          <TextInput
            label="Branch Code"
            disabled={hasFieldDisable}
            error={errors.branch_code?.message}
            {...register("branch_code", {
              required: "Outlet Name is required",
            })}
          />
          <TextInput
            label="Phone"
            disabled={hasFieldDisable}
            error={errors.contact?.message}
            {...register("contact", {
              required: "Phone number is required",
            })}
          />
          <TextInput
            label="Email"
            disabled={hasFieldDisable}
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
              disabled={hasFieldDisable}
              error={errors.full_address?.district?.message}
              {...register("full_address.district", {
                required: "District is required",
              })}
              options={districtsOptions}
            />
            <TextInput
              label="Postal Code"
              disabled={hasFieldDisable}
              error={errors.full_address?.post_code?.message}
              {...register("full_address.post_code", {
                required: "Postal Code is required",
                validate: (value) =>
                  /^\d{5}$/.test(String(value)) ||
                  "Postal Code must be exactly 5 digits",
              })}
            />
            <TextInput
              label="Address"
              disabled={hasFieldDisable}
              error={errors.full_address?.address?.message}
              {...register("full_address.address", {
                required: "Address is required",
              })}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Stock Management</h3>
            <div className="space-y-4">
              {gasTypeData?.map((gasType, index) => {
                return (
                  <div key={index} className="grid grid-cols-4 gap-6">
                    <div className="flex items-center">
                      <p
                        {...register(`cylinders_stock.${index}.type`, {
                          value: gasType?._id || "",
                        })}
                      >
                        {gasType.name}
                      </p>
                    </div>

                    <TextInput
                      label="Max Capacity"
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
                      label="Min Threshold"
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
                      label={`Current Stock`}
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
            <Button type="submit" disabled={hasFieldDisable}>
              Save
            </Button>
            <Button
              type="button"
              onClick={() => {
                navigator(-1);
                reset();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Back
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OutletForm;

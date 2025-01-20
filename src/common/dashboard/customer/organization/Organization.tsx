import { useForm } from "react-hook-form";
import GasRequestTypeEnum from "../../../../constant/gasRequestTypeEnum";
import RequestStatusEnum from "../../../../constant/requestStatusEnum";
import ICustomer from "../../../../type/ICustomer";
import {
  Button,
  Radio,
  Select,
  TextInput,
} from "../../../ui-components/form-fields";
import { useMemo, useState } from "react";
import useGetOutlets from "../../../../hooks/useGetOutlets";
import Banner from "../../../ui-components/banner";
import { requestTypeOptions } from "../../../../constant/selectOptions";
import gasTypeOption from "../../../../constant/gasTypeOptions";

interface IOrganizationProps {
  profile: ICustomer;
}

const Organization = ({ profile }: IOrganizationProps) => {
  const [gasRequestType, setGasRequestType] = useState<GasRequestTypeEnum>(
    GasRequestTypeEnum.Refilled_Gas
  );

  const { data: outlets } = useGetOutlets();

  const outletOptions = useMemo(() => {
    if (!outlets) {
      return [];
    }

    return outlets.map((outlet) => ({
      label: outlet.name,
      value: outlet._id!,
    }));
  }, [outlets]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {};

  if (
    profile?.organization_details?.approval_status === RequestStatusEnum.PENDING
  ) {
    return (
      <div className="h-1/2 flex flex-col items-center justify-center bg-gray-100 p-2">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-semibold text-gray-800">
          Your account is not approved yet.
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-600 mt-2">
          Your documents are under review, and the approval process may take up
          to 1 week. Once approved, you will be notified, and you can proceed
          with requesting gas.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Gas Request Form</h1>
      {gasRequestType === GasRequestTypeEnum.New_Gas && (
        <Banner type="info">
          For new gas, payment is required for both the gas and the cylinders.
        </Banner>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Select
          label="Request Type"
          // error={errors.business_type?.message}
          {...register("request_type", {
            required: "Please select Request Type",
            onChange: (e) => setGasRequestType(e.target.value),
          })}
          value={gasRequestType}
          options={requestTypeOptions}
        />
        <Radio
          label="Select Gas Type"
          options={gasTypeOption}
          // error={errors.gasType?.message}
          {...register("gasType", { required: "Please select a gas type" })}
        />
        <TextInput
          label="Gas Quantity"
          // error={errors.individual_details?.first_name?.message}
          {...register("gas_quantity", {
            required: "Gas Quantity is required",
          })}
          type="number"
        />
        <Select
          label="Outlet"
          // error={errors.business_type?.message}
          {...register("outlet", {
            required: "Please select Outlet",
            // onChange: (e) =>
            // handleSelectChange(e.target.value as CustomerTypeEnum),
          })}
          options={outletOptions}
        />
        <Button type="submit" className="w-full">
          Submit Request
        </Button>
      </form>
    </div>
  );
};

export default Organization;

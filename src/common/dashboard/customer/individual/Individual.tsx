import { useState } from "react";
import { useForm } from "react-hook-form";
import GasRequestTypeEnum from "../../../../constant/gasRequestTypeEnum";
import ICustomerProfile from "../../../../type/ICustomerProfile";
import Banner from "../../../ui-components/banner";
import { Button, Select, TextInput } from "../../../ui-components/form-fields";

interface IndividualProps {
  profile: ICustomerProfile;
}

const requestTypeOptions = [
  {
    value: GasRequestTypeEnum.New_Gas,
    label: GasRequestTypeEnum.New_Gas,
  },
  {
    value: GasRequestTypeEnum.Refilled_Gas,
    label: GasRequestTypeEnum.Refilled_Gas,
  },
];

const Individual = ({ profile }: IndividualProps) => {
  const [gasRequestType, setGasRequestType] = useState<GasRequestTypeEnum>(
    GasRequestTypeEnum.Refilled_Gas
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {};
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
          options={[]}
        />
        <Button type="submit" className="w-full">
          Submit Request
        </Button>
      </form>
    </div>
  );
};

export default Individual;

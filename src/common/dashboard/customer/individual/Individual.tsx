import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import GasRequestTypeEnum from "../../../../constant/gasRequestTypeEnum";
import gasTypeOption from "../../../../constant/gasTypeOptions";
import { requestTypeOptions } from "../../../../constant/selectOptions";
import useGetOutlets from "../../../../hooks/useGetOutlets";
import ICustomer from "../../../../type/ICustomer";
import Banner from "../../../ui-components/banner";
import { Button, Radio, Select } from "../../../ui-components/form-fields";
import IGasRequest from "../../../../type/IGasRequest";
import GasTypeEnum from "../../../../constant/gasTypesEnum";
import useApiFetch from "../../../../hooks/useApiFetch";
import LoadingSpinner from "../../../ui-components/loadingSpinner";

interface IndividualProps {
  profile: ICustomer;
}

const Individual = ({ profile }: IndividualProps) => {
  const [gasRequestType, setGasRequestType] = useState<GasRequestTypeEnum>(
    GasRequestTypeEnum.Refilled_Gas
  );
  const [selectedOutlet, setSelectedOutlet] = useState<string>();

  const { isLoading, error, postData } = useApiFetch<IGasRequest>({
    url: "/gas-request/create",
  });

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
    formState: { errors },
  } = useForm<IGasRequest>();

  const onSubmit: SubmitHandler<IGasRequest> = async (data) => {
    const saveData: IGasRequest = {
      ...data,
      userId: profile._id!,
      gas: {
        ...data.gas,
        individual: {
          type: data.gas.individual?.type as GasTypeEnum,
          requestType: data.gas.individual?.requestType!,
          gasQuantity: 1,
        },
      },
    };
    await postData(saveData);
  };

  const selectedOutletData = useMemo(
    () => outlets?.find((o) => o._id === selectedOutlet),
    [selectedOutlet, outlets]
  );

  const hasNotGasRequestEnabled =
    selectedOutletData && selectedOutletData?.is_request_enable === false;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Gas Request Form</h1>
      {isLoading && <LoadingSpinner />}
      {gasRequestType === GasRequestTypeEnum.New_Gas && (
        <Banner type="info">
          For new gas, payment is required for both the gas and the cylinders.
        </Banner>
      )}
      {hasNotGasRequestEnabled && (
        <Banner type="warning">This outlet is not enabled for requests.</Banner>
      )}
      {error && <Banner type="error">{error}</Banner>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Select
          label="Request Type"
          error={errors.gas?.individual?.requestType?.message}
          {...register("gas.individual.requestType", {
            required: "Please select Request Type",
            onChange: (e) => setGasRequestType(e.target.value),
          })}
          defaultValue={gasRequestType}
          options={requestTypeOptions}
        />
        <Radio
          label="Select Gas Type"
          options={gasTypeOption}
          {...register("gas.individual.type", {
            required: "Please select a gas type",
          })}
          selected={gasTypeOption[0].value}
        />
        <Select
          label="Outlet"
          error={errors.outletId?.message}
          {...register("outletId", {
            required: "Please select Outlet",
            onChange: (e) => setSelectedOutlet(e.target.value),
          })}
          options={outletOptions}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={hasNotGasRequestEnabled}
        >
          Submit Request
        </Button>
      </form>
    </div>
  );
};

export default Individual;

import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ActiveStatus from "../../../../constant/activeStatusOptions";
import DeliveryStatusEnum from "../../../../constant/DeliveryStatusEnum";
import GasRequestTypeEnum from "../../../../constant/gasRequestTypeEnum";
import gasTypeOption from "../../../../constant/gasTypeOptions";
import GasTypeEnum from "../../../../constant/gasTypesEnum";
import { requestTypeOptions } from "../../../../constant/selectOptions";
import useApiFetch from "../../../../hooks/useApiFetch";
import useGetGasRequest from "../../../../hooks/useGetGasRequest";
import useGetOutlets from "../../../../hooks/useGetOutlets";
import useGetSchedule from "../../../../hooks/useGetSchedule";
import ICustomer from "../../../../type/ICustomer";
import IGasRequest from "../../../../type/IGasRequest";
import IToken from "../../../../type/IToken";
import Banner from "../../../ui-components/banner";
import { Button, Radio, Select } from "../../../ui-components/form-fields";
import LoadingSpinner from "../../../ui-components/loadingSpinner";

interface IndividualProps {
  profile: ICustomer;
}

const Individual = ({ profile }: IndividualProps) => {
  const [gasRequestType, setGasRequestType] = useState<GasRequestTypeEnum>(
    GasRequestTypeEnum.Refilled_Gas
  );
  const [selectedOutlet, setSelectedOutlet] = useState<string>();
  const { data: gasRequest, fetchData } = useGetGasRequest({
    userId: profile._id,
  });
  const { data: schedules } = useGetSchedule();
  const { isLoading, error, postData } = useApiFetch<IGasRequest>({
    url: "/gas-request/create",
  });

  const { data: outlets } = useGetOutlets();

  const outletOptions = useMemo(() => {
    if (!outlets) {
      return [];
    }

    return outlets.map((outlet) => ({
      label: outlet.name!,
      value: outlet._id!,
    }));
  }, [outlets]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IGasRequest>();

  const schedule = useMemo(() => {
    const selectedOutletD = outlets.find(
      (outlet) => outlet._id === selectedOutlet
    );
    return schedules.find(
      (schedule) =>
        selectedOutletD?.full_address.district === schedule?.district
    );
  }, [schedules, profile, selectedOutlet]);

  const onSubmit: SubmitHandler<IGasRequest> = async (data) => {
    const saveData: IGasRequest = {
      ...data,
      userId: profile._id!,
      outletId: selectedOutlet!,
      scheduleId: schedule?._id,
      gas: {
        ...data.gas,
        individual: {
          type: data.gas.individual?.type as GasTypeEnum,
          requestType: data.gas.individual?.requestType!,
          isCylinderReturned: false,
          gasQuantity: 1,
        },
      },
      createdBy: profile.role!,
    };

    await postData(saveData);
    await fetchData({ userId: profile._id });
  };

  const selectedOutletData = useMemo(
    () => outlets?.find((o) => o._id === selectedOutlet),
    [selectedOutlet, outlets]
  );

  const hasNotGasRequestEnabled = !(
    selectedOutletData?.gas_request?.is_allowed &&
    schedule?.status === DeliveryStatusEnum.Pending
  );

  if (
    gasRequest &&
    gasRequest.length > 0 &&
    (gasRequest[0].tokenId as IToken)?.status === ActiveStatus.ACTIVE
  ) {
    return (
      <div className="h-1/2 flex flex-col items-center justify-center bg-gray-100 p-2">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-semibold text-gray-800">
          You have an active token
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-600 mt-2">
          <span className="font-bold text-blue-600 bg-yellow-200 px-2 py-1 rounded-lg">
            {(gasRequest[0].tokenId as IToken).token}
          </span>
        </p>
      </div>
    );
  }

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
          disabled={hasNotGasRequestEnabled}
        />
        <Radio
          label="Select Gas Type"
          options={gasTypeOption}
          {...register("gas.individual.type", {
            required: "Please select a gas type",
          })}
          selected={gasTypeOption[0].value}
          disabled={hasNotGasRequestEnabled}
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

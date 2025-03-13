import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ActiveStatus from "../../../../constant/activeStatusOptions";
import DeliveryStatusEnum from "../../../../constant/DeliveryStatusEnum";
import GasRequestTypeEnum from "../../../../constant/gasRequestTypeEnum";
import { requestTypeOptions } from "../../../../constant/selectOptions";
import useApiFetch from "../../../../hooks/useApiFetch";
import useGetGasTypes from "../../../../hooks/useGetGasTypes";
import useGetIndividualGasRequest from "../../../../hooks/useGetIndividualGasRequest";
import useGetOutlets from "../../../../hooks/useGetOutlets";
import useGetSchedule from "../../../../hooks/useGetSchedule";
import ICustomer from "../../../../type/ICustomer";
import { IIndividualCustomerGasRequest } from "../../../../type/IGasRequest";
import IToken from "../../../../type/IToken";
import Banner from "../../../ui-components/banner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../ui-components/card/Card";
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
  const { data: gasRequest, fetchData } = useGetIndividualGasRequest({
    userId: profile._id,
  });
  const { data: schedules } = useGetSchedule();
  const { data: gasTypeData } = useGetGasTypes();
  const { isLoading, error, postData } =
    useApiFetch<IIndividualCustomerGasRequest>({
      url: "/gas-request/individual",
    });

  const { data: outlets } = useGetOutlets();

  const gasTypeOption = useMemo(() => {
    if (!gasTypeData) {
      return [];
    }

    return gasTypeData.map((gasType) => ({
      label: `${gasType.name} - ${gasType.description} - LKR ${gasType.price}`,
      value: gasType._id!,
    }));
  }, [gasTypeData]);

  const outletOptions = useMemo(() => {
    if (!outlets) {
      return [];
    }

    return outlets.map((outlet) => ({
      label: `${outlet.branch_code} - ${outlet.name}`,
      value: outlet._id!,
    }));
  }, [outlets]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IIndividualCustomerGasRequest>();

  const schedule = useMemo(() => {
    const selectedOutletD = outlets.find(
      (outlet) => outlet._id === selectedOutlet
    );
    return schedules.find(
      (schedule) =>
        selectedOutletD?.full_address.district === schedule?.district
    );
  }, [schedules, profile, selectedOutlet]);

  const onSubmit: SubmitHandler<IIndividualCustomerGasRequest> = async (
    data
  ) => {
    const saveData: IIndividualCustomerGasRequest = {
      ...data,
      userId: profile._id!,
      outletId: selectedOutlet!,
      scheduleId: schedule?._id!,
      gas: {
        ...data.gas,
        type: data.gas?.type,
        requestType: data.gas?.requestType!,
        isCylinderReturned: false,
        gasQuantity: 1,
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

  const hasNotGasRequestEnabled = useMemo(() => {
    const selectedOutletGasRequest = selectedOutletData?.gas_request;
    const hasAllowedDateInRange = selectedOutletGasRequest?.active_until || "";

    const givenDate = new Date(hasAllowedDateInRange);
    const currentDate = new Date();

    return (
      selectedOutletData &&
      !(
        selectedOutletGasRequest?.is_allowed &&
        selectedOutletGasRequest?.allowed_qty! > 0 &&
        givenDate > currentDate &&
        schedule?.status === DeliveryStatusEnum.Pending
      )
    );
  }, [selectedOutletData, schedule]);

  const token = gasRequest.filter(
    (item) => item.status === DeliveryStatusEnum.Pending
  )[0]?.tokenId as IToken;

  if (gasRequest && gasRequest.length > 0 && !token) {
    return (
      <div className="h-1/2 flex flex-col items-center justify-center bg-gray-100 p-2">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-semibold text-gray-800">
          You are request has been in waiting list. Once token available, you
          will be notified by email.
        </p>
      </div>
    );
  }

  if (
    gasRequest &&
    gasRequest.length > 0 &&
    token?.status === ActiveStatus.ACTIVE &&
    new Date(token?.expiryDate) > new Date()
  ) {
    return (
      <div className="h-1/2 flex flex-col items-center justify-center bg-gray-100 p-2">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-semibold text-gray-800">
          You have an active token
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-600 mt-2">
          <span className="font-bold text-blue-600 bg-yellow-200 px-2 py-1 rounded-lg">
            {token?.token}
          </span>
        </p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gas Request Form</CardTitle>
      </CardHeader>
      <CardContent>
        {hasNotGasRequestEnabled && (
          <Banner type="warning">
            This outlet is not enabled for requests.
          </Banner>
        )}
        {outletOptions.length === 0 && (
          <Banner type="info">
            No Outlets available
          </Banner>
        )}
        {isLoading && <LoadingSpinner />}
        {error && <Banner type="error">{error}</Banner>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Select
            label="Request Type"
            error={errors.gas?.requestType?.message}
            {...register("gas.requestType", {
              required: "Please select Request Type",
              onChange: (e) => setGasRequestType(e.target.value),
            })}
            defaultValue={gasRequestType}
            options={requestTypeOptions}
            disabled={hasNotGasRequestEnabled || outletOptions.length === 0}
          />
          <Radio
            label="Select Gas Type"
            options={gasTypeOption}
            {...register("gas.type", {
              required: "Please select a gas type",
            })}
            selected={gasTypeData[0]?.name}
            disabled={hasNotGasRequestEnabled || outletOptions.length === 0}
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
            disabled={hasNotGasRequestEnabled || outletOptions.length === 0}
          >
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Individual;

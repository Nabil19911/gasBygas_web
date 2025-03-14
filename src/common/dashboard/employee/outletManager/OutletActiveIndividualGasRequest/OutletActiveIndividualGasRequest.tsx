import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import DeliveryStatusEnum from "../../../../../constant/DeliveryStatusEnum";
import GasRequestTypeEnum from "../../../../../constant/gasRequestTypeEnum";
import {
  deliveryStatusOptions,
  paymentMethodOptions,
  paymentOptions,
} from "../../../../../constant/selectOptions";
import useApiFetch from "../../../../../hooks/useApiFetch";
import useFetch from "../../../../../hooks/useFetch";
import ICustomer from "../../../../../type/ICustomer";
import { ISchedule } from "../../../../../type/IDeliveryRequest";
import { IIndividualCustomerGasRequest } from "../../../../../type/IGasRequest";
import IGasType from "../../../../../type/IGasType";
import Banner from "../../../../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import {
  Button,
  CheckboxInput,
  Select,
  TextInput,
} from "../../../../ui-components/form-fields";
import LoadingSpinner from "../../../../ui-components/loadingSpinner";
import PaymentStatusEnum from "../../../../../constant/paymentStatusEnum";

const OutletActiveIndividualGasRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: gasRequest,
    isLoading: isGasRquestLoading,
    error,
  } = useFetch<IIndividualCustomerGasRequest>({
    url: `/gas-request/individual/${id}`,
    initialLoad: true,
  });

  const {
    postData: updateGasRequest,
    isLoading: isUpdating,
    error: updateError,
  } = useApiFetch<Partial<IIndividualCustomerGasRequest>>({
    url: `/gas-request/individual/${id}`,
    options: { method: "patch" },
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<IIndividualCustomerGasRequest>>();

  useEffect(() => {
    reset({ ...gasRequest });
  }, [gasRequest]);

  const isLoading = isGasRquestLoading || isUpdating;

  const hasFieldDisabled = gasRequest?.status === DeliveryStatusEnum.Cancelled;

  const onSubmit: SubmitHandler<
    Partial<IIndividualCustomerGasRequest>
  > = async (data) => {
    await updateGasRequest({
      ...gasRequest,
      payment: {
        ...gasRequest?.payment,
        status: PaymentStatusEnum.PAID,
        totalAmount: Number(data.payment?.totalAmount),
        method: data.payment?.method,
        paymentDate: new Date(),
      },
      isWaiting: false,
      gas: {
        ...gasRequest?.gas,
        isCylinderReturned: data.gas?.isCylinderReturned,
      },
      status: data.status
    });

    if (!isLoading && !updateError) {
      navigate(-1);
    }
  };

  const isNewGas = gasRequest?.gas.requestType === GasRequestTypeEnum.New_Gas;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {isLoading && <LoadingSpinner />}

      <CardHeader>
        <CardTitle>Manage Gas Request</CardTitle>
        <CardDescription>Update payment.</CardDescription>
      </CardHeader>

      <CardContent>
        {error && <Banner type="error">{error}</Banner>}
        {updateError && <Banner type="error">{updateError}</Banner>}
        {hasFieldDisabled && (
          <Banner type="warning">
            Gas Request is Canceled
            <br />
            Reason: {gasRequest.comment}
          </Banner>
        )}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="grid grid-cols-2">
            <p className="font-semibold">Name:</p>
            <p>
              {
                (gasRequest?.userId! as ICustomer)?.individual_details
                  ?.first_name
              }
            </p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-semibold">Gas Type:</p>
            <p>{(gasRequest?.gas?.type as IGasType)?.name}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-semibold">Current Schedule Date:</p>
            <p>
              {new Date(
                (gasRequest?.scheduleId as ISchedule)?.deliveryDate || ""
              ).toDateString() || "Not Scheduled"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="mb-2 font-bold">Update Payment</h2>
          {!isNewGas && (
            <CheckboxInput
              label="Gas returned"
              disabled={hasFieldDisabled}
              id="gas_request"
              {...register("gas.isCylinderReturned")}
            />
          )}
          <Select
            label="Payment Status"
            options={paymentOptions}
            disabled={true}
            {...register("payment.status")}
          />
          <TextInput
            label="Total Amount"
            type="number"
            disabled={true}
            value={
              isNewGas
                ? (gasRequest?.gas?.type as IGasType)?.cylinder_price
                : (gasRequest?.gas?.type as IGasType)?.price
            }
            {...register("payment.totalAmount")}
          />
          <Select
            label="Payment Method"
            options={paymentMethodOptions}
            {...register("payment.method", {
              required: "Payment method is required",
            })}
            disabled={hasFieldDisabled || gasRequest?.payment?.status === PaymentStatusEnum.PAID}
            error={errors.payment?.method?.message}
          />
          <Select
            label="Status"
            disabled={hasFieldDisabled}
            options={deliveryStatusOptions.filter(
              (item) => item.value !== DeliveryStatusEnum.OutForDelivery
            )}
            {...register("status", {})}
          />

          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={isLoading || hasFieldDisabled}>
              Pay
            </Button>
            <Button
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Back
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OutletActiveIndividualGasRequest;

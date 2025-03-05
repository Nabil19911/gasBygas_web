import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import PaymentStatusEnum from "../../../../../constant/paymentStatusEnum";
import {
  deliveryStatusOptions,
  paymentMethodOptions,
  paymentOptions,
} from "../../../../../constant/selectOptions";
import useApiFetch from "../../../../../hooks/useApiFetch";
import useFetch from "../../../../../hooks/useFetch";
import ICustomer from "../../../../../type/ICustomer";
import { IOrganizationGasRequest } from "../../../../../type/IGasRequest";
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
} from "../../../../ui-components/form-fields";
import LoadingSpinner from "../../../../ui-components/loadingSpinner";

const OutletActiveOrganizationGasRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: gasRequest,
    isLoading: isGasRquestLoading,
    error,
  } = useFetch<IOrganizationGasRequest>({
    url: `/gas-request/organization/${id}`,
    initialLoad: true,
  });

  const {
    postData: updateGasRequest,
    isLoading: isUpdating,
    error: updateError,
  } = useApiFetch<Partial<IOrganizationGasRequest>>({
    url: `/gas-request/organization/${id}`,
    options: { method: "patch" },
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<IOrganizationGasRequest>>();

  useEffect(() => {
    reset({ ...gasRequest });
  }, [gasRequest]);

  console.log({ gasRequest });

  const isLoading = isGasRquestLoading || isUpdating;

  const hasFieldDisabled =
    gasRequest?.payment?.status === PaymentStatusEnum.PAID;

  const onSubmit: SubmitHandler<Partial<IOrganizationGasRequest>> = async (
    data
  ) => {
    await updateGasRequest({
      ...gasRequest,
      payment: {
        ...gasRequest?.payment,
        status: data.payment?.status,
        totalAmount: Number(data.payment?.totalAmount),
        method: data.payment?.method,
        paymentDate: new Date(),
      },
      gas: gasRequest?.gas || [],
    });

    if (!isLoading && !updateError) {
      navigate(-1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {isLoading && <LoadingSpinner />}

      <CardHeader>
        <CardTitle>Manage Gas Request</CardTitle>
        <CardDescription>
          Update payment.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && <Banner type="error">{error}</Banner>}
        {updateError && <Banner type="error">{updateError}</Banner>}
        {hasFieldDisabled && (
          <Banner type="info">Payment is Already done</Banner>
        )}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="grid grid-cols-2">
            <p className="font-semibold">Name:</p>
            <p>
              {
                (gasRequest?.userId! as ICustomer)?.organization_details
                  ?.business_name
              }
            </p>
          </div>

          {gasRequest?.gas?.map((item, index) => {
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <p className="font-semibold">Gas Type:</p>
                  <p>{(item.type as IGasType)?.name}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="font-semibold">Total Price:</p>
                  <p>{(item.type as IGasType)?.price || ""}</p>
                </div>
                <CheckboxInput
                  label="Gas returned"
                  disabled={hasFieldDisabled}
                  id="gas_request"
                  {...register(
                    `gas.${index}.gasNewRequests.isCylinderReturned`
                  )}
                />
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="mb-2 font-bold">Update Payment</h2>
          <Select
            label="Payment Status"
            options={paymentOptions}
            disabled={hasFieldDisabled}
            {...register("payment.status")}
          />
          <Select
            label="Payment Method"
            options={paymentMethodOptions}
            {...register("payment.method", {
              required: "Payment method is required",
            })}
            disabled={hasFieldDisabled}
            error={errors.payment?.method?.message}
          />

          <Select
            label="Status"
            options={deliveryStatusOptions}
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

export default OutletActiveOrganizationGasRequest;

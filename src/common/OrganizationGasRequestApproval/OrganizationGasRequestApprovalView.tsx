import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import RequestStatusEnum from "../../constant/requestStatusEnum";
import useApiFetch from "../../hooks/useApiFetch";
import useFetch from "../../hooks/useFetch";
import { getUserProfile } from "../../store/selectors/profileSelector";
import { TProfileData } from "../../store/silces/profileSlice";
import { useAppSelector } from "../../store/store";
import { IOrganizationGasRequest } from "../../type/IGasRequest";
import Banner from "../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { Button, Textarea, TextInput } from "../ui-components/form-fields";
import LoadingSpinner from "../ui-components/loadingSpinner";

const OrganizationGasRequestApprovalView = () => {
  const [action, setAction] = useState<RequestStatusEnum>();
  const { id } = useParams();
  const navigator = useNavigate();
  const { data: profile } = useAppSelector(getUserProfile);

  const {
    data: gasRequest,
    isLoading,
    error,
  } = useFetch<IOrganizationGasRequest>({
    url: `/gas-request/organization/${id}`,
    initialLoad: true,
  });

  const {
    postData: updateApproval,
    isLoading: isUpdating,
    error: updateError,
  } = useApiFetch<IOrganizationGasRequest>({
    url: `/gas-request/organization/${id}`,
    options: { method: "patch" },
  });

  const { register, handleSubmit, reset } = useForm<IOrganizationGasRequest>();

  const handleButtonClick = (status: RequestStatusEnum) => {
    setAction(status);
  };

  const onSubmit: SubmitHandler<IOrganizationGasRequest> = async (data) => {
    await updateApproval({
      ...data,
      userId: (gasRequest?.userId as TProfileData)?._id!,
      headOfficeApproval: {
        ...data.headOfficeApproval,
        status: action!,
        date: new Date(),
        approvedBy: profile?.first_name,
      },
    });

    if (!isLoading && !error) {
      reset();
      navigator(-1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {isLoading && <LoadingSpinner />}
      {error && <Banner type="error">{error}</Banner>}
      {updateError && <Banner type="error">{updateError}</Banner>}

      <CardHeader>
        <CardTitle>Approve Organization Gas Request</CardTitle>
        <CardDescription>
          Review and approve gas request details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="grid grid-cols-2">
            <p className="font-semibold">Name:</p>
            <p>
              {(gasRequest?.userId as any)?.organization_details?.business_name}
            </p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-semibold">Payment Status:</p>
            <p>{gasRequest?.payment?.status}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-semibold">Approval Status:</p>
            <p>{gasRequest?.headOfficeApproval?.status || "Pending"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="mb-2 font-bold">Gas request</h2>
          {gasRequest?.gas?.map((gasType, index) => (
            <div key={index} className="grid grid-cols-4 gap-4">
              <TextInput
                label={`Gas Type ${index + 1}`}
                disabled
                value={gasType.type}
                {...register(`gas.${index}.type`, {})}
              />
              <TextInput
                label={`Request Type ${index + 1}`}
                disabled
                value={gasType.requestType}
                {...register(`gas.${index}.requestType`, {})}
              />
              <TextInput
                label="Requested QTY"
                type="number"
                disabled
                value={gasType.gasQuantity}
                {...register(`gas.${index}.gasQuantity`, {})}
              />
              <TextInput
                label="Approved QTY"
                type="number"
                {...register(`gas.${index}.approvedQuantity`, {})}
              />
            </div>
          ))}

          {/* <h2 className="font-bold">Payment</h2>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Payment Method"
              {...register("payment.method")}
              defaultValue={paymentMethodOptions[0].value}
              options={paymentMethodOptions}
            />

            <TextInput
              label="Amount"
              type="number"
              {...register("payment.totalAmount")}
            />
          </div> */}

          <Textarea
            label="Comment"
            placeholder="Enter any additional details"
            {...register("headOfficeApproval.comment")}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              onClick={() => handleButtonClick(RequestStatusEnum.REGECTED)}
              disabled={isUpdating}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Reject
            </Button>
            <Button
              type="submit"
              onClick={() => handleButtonClick(RequestStatusEnum.APPROVED)}
              disabled={isUpdating}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Approve
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrganizationGasRequestApprovalView;

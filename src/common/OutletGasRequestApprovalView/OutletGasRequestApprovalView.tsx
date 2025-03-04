import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import RequestStatusEnum from "../../constant/requestStatusEnum";
import useApiFetch from "../../hooks/useApiFetch";
import useFetch from "../../hooks/useFetch";
import { getUserProfile } from "../../store/selectors/profileSelector";
import { useAppSelector } from "../../store/store";
import { ISchedule } from "../../type/IDeliveryRequest";
import IGasType from "../../type/IGasType";
import { IOutlet } from "../../type/IOutlet";
import { IOutletGasRequest } from "../../type/IOutletGasRequest";
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

const OutletGasRequestApprovalView = () => {
  const [action, setAction] = useState<RequestStatusEnum>();
  const { id } = useParams();
  const navigator = useNavigate();
  const { data: profile } = useAppSelector(getUserProfile);

  const {
    data: gasRquest,
    isLoading: isOutletGasRequestLoading,
    error,
  } = useFetch<IOutletGasRequest>({
    url: `/gas-request/outlet/${id}`,
    initialLoad: true,
  });

  const {
    postData: updateApproval,
    isLoading: isUpdateApprovalLoading,
    error: errorApproval,
  } = useApiFetch<IOutletGasRequest>({
    url: `/gas-request/outlet/${id}`,
    options: {
      method: "patch",
    },
  });

  const isLoading = isOutletGasRequestLoading || isUpdateApprovalLoading;
  const { register, handleSubmit, reset } = useForm<IOutletGasRequest>();

  const handleButtonClick = (actionType: RequestStatusEnum) => {
    setAction(actionType);
  };

  const onSubmit: SubmitHandler<IOutletGasRequest> = async (data) => {
    await updateApproval({
      ...data,
      headOfficeApproval: {
        ...data.headOfficeApproval,
        status: action!,
        approvedDate: new Date(),
        approvedBy: profile?.first_name,
      },
    });

    if (!isLoading && !error) {
      reset();
      navigator(-1); // Navigate back
    }
  };

  const hasFieldDisabled =
    gasRquest?.headOfficeApproval?.status === RequestStatusEnum.APPROVED;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {isLoading && <LoadingSpinner />}
      {error && <Banner type="error">{error}</Banner>}
      {errorApproval && <Banner type="error">{errorApproval}</Banner>}
      <CardHeader className="text-xl font-semibold flex items-center">
        <CardTitle>
          <div className="flex items-center flex-initial w-full">
            Approve Outlet Gas Request
          </div>
        </CardTitle>
        <CardDescription>Outlet gas request details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold">Branch Code:</p>
            <p>{(gasRquest?.outletId as IOutlet)?.branch_code}</p>
          </div>
          <div>
            <p className="font-semibold">Delivery Date:</p>
            <p>
              {new Date(
                (gasRquest?.scheduleId! as ISchedule)?.deliveryDate || ""
              ).toLocaleDateString("en-CA")}
            </p>
          </div>
          <div>
            <p className="font-semibold">Delivery Status:</p>
            <p>{(gasRquest?.scheduleId! as ISchedule)?.status}</p>
          </div>
          <div>
            <p className="font-semibold">Head Office approval status:</p>
            <p>{gasRquest?.headOfficeApproval?.status}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">District:</p>
            <p>{(gasRquest?.scheduleId as ISchedule)?.district}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="font-bold">Requested gas</h2>
          {gasRquest?.gas?.map((gasType, gasIndex) => {
            return (
              <div key={gasIndex} className="grid grid-cols-3 gap-4">
                <TextInput
                  label={`Gas Type ${gasIndex + 1}`}
                  disabled
                  value={(gasType.type as IGasType).name}
                  {...register(`gas.${gasIndex}.type`, {})}
                />

                <TextInput
                  label="Requested QTY"
                  type="number"
                  disabled
                  defaultValue={
                    gasType.approvedGasQuantity ?? gasType.gasQuantity
                  }
                  {...register(`gas.${gasIndex}.gasQuantity`, {})}
                />
                <TextInput
                  label="Approved QTY"
                  type="number"
                  disabled={hasFieldDisabled}
                  defaultValue={
                    gasType.approvedGasQuantity ?? gasType.gasQuantity
                  }
                  {...register(`gas.${gasIndex}.approvedGasQuantity`, {})}
                />
              </div>
            );
          })}

          <Textarea
            label="Comment"
            disabled={hasFieldDisabled}
            placeholder="Enter any additional details"
            {...register("headOfficeApproval.comment")}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              onClick={() => handleButtonClick(RequestStatusEnum.REGECTED)}
              disabled={isLoading || hasFieldDisabled}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Reject
            </Button>
            <Button
              type="submit"
              onClick={() => handleButtonClick(RequestStatusEnum.APPROVED)}
              disabled={isLoading || hasFieldDisabled}
            >
              Approve
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OutletGasRequestApprovalView;

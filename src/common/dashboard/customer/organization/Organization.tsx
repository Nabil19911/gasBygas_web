import { SubmitHandler, useForm } from "react-hook-form";
import ActiveStatus from "../../../../constant/activeStatusOptions";
import gasTypeOption from "../../../../constant/gasTypeOptions";
import RequestStatusEnum from "../../../../constant/requestStatusEnum";
import { requestTypeOptions } from "../../../../constant/selectOptions";
import useApiFetch from "../../../../hooks/useApiFetch";
import useGetOrganizationGasRequest from "../../../../hooks/useGetOrganizationGasRequest";
import ICustomer from "../../../../type/ICustomer";
import { IOrganizationGasRequest } from "../../../../type/IGasRequest";
import IToken from "../../../../type/IToken";
import Banner from "../../../ui-components/banner";
import { Button, Select, TextInput } from "../../../ui-components/form-fields";
import LoadingSpinner from "../../../ui-components/loadingSpinner";

interface IOrganizationProps {
  profile: ICustomer;
}

const Organization = ({ profile }: IOrganizationProps) => {
  const { isLoading, error, postData } = useApiFetch<IOrganizationGasRequest>({
    url: "/gas-request/organization",
  });

  const { data: gasRequest, fetchData } = useGetOrganizationGasRequest({
    userId: profile._id,
  });

  const { register, handleSubmit } = useForm<IOrganizationGasRequest>();

  const onSubmit: SubmitHandler<Partial<IOrganizationGasRequest>> = async (
    data
  ) => {
    const saveData: IOrganizationGasRequest = {
      ...data,
      userId: profile._id!,
      gas: [...(data?.gas ?? [])],
      createdBy: profile.role!,
    };

    await postData(saveData);
    await fetchData({ userId: profile._id });
  };

  if (
    gasRequest &&
    gasRequest.length > 0 &&
    gasRequest[0]?.headOfficeApproval?.status === RequestStatusEnum.PENDING
  ) {
    return (
      <div className="h-1/2 flex flex-col items-center justify-center bg-gray-100 p-2">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-semibold text-gray-800">
          Your request has been submitted successfully. Please wait for
          approval.
        </p>
      </div>
    );
  }

  if (
    gasRequest &&
    gasRequest.length > 0 &&
    (gasRequest[0].tokenId as unknown as IToken)?.status === ActiveStatus.ACTIVE
  ) {
    return (
      <div className="h-1/2 flex flex-col items-center justify-center bg-gray-100 p-2">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-semibold text-gray-800">
          You have an active token
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-600 mt-2">
          <span className="font-bold text-blue-600 bg-yellow-200 px-2 py-1 rounded-lg">
            {(gasRequest[0].tokenId as unknown as IToken).token}
          </span>
        </p>
      </div>
    );
  }

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
      {isLoading && <LoadingSpinner />}
      <h1 className="text-2xl font-bold mb-6 text-center">
        Organization Gas Request Form
      </h1>
      {error && <Banner type="error">{error}</Banner>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {gasTypeOption.map((gasType, gasIndex) => {
          return (
            <div key={gasIndex} className="grid grid-cols-3 gap-2">
              <TextInput
                label={`Gas Type ${gasIndex + 1}`}
                disabled
                value={gasType.value}
                {...register(`gas.${gasIndex}.type`, {})}
              />
              <Select
                label="Request Type"
                {...register(`gas.${gasIndex}.requestType`, {
                  required: "Please select Request Type",
                })}
                options={requestTypeOptions}
              />
              <TextInput
                label={`Request Stock`}
                type="number"
                defaultValue={0}
                {...register(`gas.${gasIndex}.gasQuantity`, {})}
                min={0}
              />
            </div>
          );
        })}
        <Button type="submit" className="w-full">
          Submit Request
        </Button>
      </form>
    </div>
  );
};

export default Organization;

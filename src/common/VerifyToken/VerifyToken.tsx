import { SquareCheck } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import GasRequestTypeEnum from "../../constant/gasRequestTypeEnum";
import PathsEnum from "../../constant/pathsEnum";
import useApiFetch from "../../hooks/useApiFetch";
import useGetIndividualGasRequest from "../../hooks/useGetIndividualGasRequest";
import {
  IIndividualCustomerGasRequest,
  IOrganizationGasRequest,
} from "../../type/IGasRequest";
import IGasType from "../../type/IGasType";
import IToken from "../../type/IToken";
import Banner from "../ui-components/banner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { Button, Link, TextInput } from "../ui-components/form-fields";
import LoadingSpinner from "../ui-components/loadingSpinner";
import CustomerTypeEnum from "../../constant/customerTypeEnum";
import useGetOrganizationGasRequest from "../../hooks/useGetOrganizationGasRequest";

type GasRequest = (IIndividualCustomerGasRequest | IOrganizationGasRequest) & {
  customerType: CustomerTypeEnum;
};

const VerifyToken = () => {
  const {
    data: tokenData,
    postData,
    isLoading,
    error,
  } = useApiFetch<Partial<GasRequest>>({
    url: "/token/check",
    options: {
      method: "post",
    },
  });

  const customer = tokenData?.customerType;

  const { data: activeGasRequests, fetchData } = useGetIndividualGasRequest({});
  const { data: activeOrgGasRequests, fetchData: fetchOrganization } =
    useGetOrganizationGasRequest({});

  const { register, handleSubmit } = useForm<IToken>();

  const onSubmit: SubmitHandler<IToken> = async (data) => {
    const res = (await postData(data as any)) as IIndividualCustomerGasRequest | IOrganizationGasRequest;
    await fetchData({
      tokenId: (res?.tokenId as IToken)?._id,
    });

    await fetchOrganization({
      tokenId: (res?.tokenId as IToken)?._id,
    });
  };

  console.log({ activeGasRequests, activeOrgGasRequests });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            <SquareCheck className="mr-2 h-5 w-5" />
            Validate Token
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center flex-initial w-full gap-2"
          >
            <div>
              <TextInput
                placeholder="Verify Token"
                {...register("token", {
                  required: "Token is required",
                })}
              />
            </div>
            <div>
              <Button size="sm" type="submit">
                Verify
              </Button>
            </div>
          </form>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <Banner type="error">{error}</Banner>}
        {isLoading && <LoadingSpinner />}

        {tokenData && (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm flex gap-1">
                <span className="font-bold">Business Type:</span>
                {customer || "N/A"}
              </p>
              <p className="text-sm flex gap-1">
                <span className="font-bold">Token:</span>
                {(tokenData?.tokenId as unknown as IToken)?.token || "N/A"}
              </p>
              <p className="flex gap-1 text-sm">
                <span className="font-bold">Token Status:</span>
                {(tokenData?.tokenId as unknown as IToken)?.status || "N/A"}
              </p>
              <p className="flex gap-1 text-sm">
                <span className="font-bold">Payment Status:</span>
                {tokenData?.payment?.status || "N/A"}
              </p>
              {customer === CustomerTypeEnum.INDIVIDUAL && (
                <div>
                  <p className="flex gap-1 text-sm">
                    <span className="font-bold">Gas Type:</span>
                    {(
                      (tokenData as IIndividualCustomerGasRequest)?.gas
                        ?.type as IGasType
                    )?.name || "N/A"}
                  </p>
                  <p className="flex gap-1 text-sm">
                    <span className="font-bold">Request Type:</span>
                    {(tokenData as IIndividualCustomerGasRequest)?.gas
                      ?.requestType || "N/A"}
                  </p>
                  {(tokenData as IIndividualCustomerGasRequest)?.gas
                    ?.requestType === GasRequestTypeEnum.Refilled_Gas && (
                    <p className="flex gap-1 text-sm">
                      <span className="font-bold">Cylinder Returned:</span>
                      {(tokenData as IIndividualCustomerGasRequest)?.gas
                        ?.isCylinderReturned
                        ? "Yes"
                        : "No"}
                    </p>
                  )}
                  <p className="flex gap-1 text-sm">
                    <span className="font-bold">Gas Quantity:</span>
                    {(tokenData as IIndividualCustomerGasRequest)?.gas
                      ?.gasQuantity || "N/A"}
                  </p>
                </div>
              )}
              {customer === CustomerTypeEnum.ORGANIZATION &&
                (tokenData as IOrganizationGasRequest)?.gas?.length! > 0 && (
                  <div>
                    {(tokenData as IOrganizationGasRequest)?.gas?.map(
                      (gasItem, index) => (
                        <div
                          key={(gasItem.type as IGasType)?._id}
                          className="mb-4 p-2 border-b"
                        >
                          <p className="flex gap-1 text-sm">
                            <span className="font-bold">
                              Gas Type {index + 1}:
                            </span>
                            {(gasItem.type as IGasType)?.name || "N/A"}
                          </p>
                          <p className="flex gap-1 text-sm">
                            <span className="font-bold">Request Type:</span>
                            {gasItem.gasNewRequests
                              ? "New Gas Request"
                              : gasItem.gasRefillRequests
                              ? "Refilled Gas Request"
                              : "N/A"}
                          </p>
                          {gasItem.gasNewRequests && (
                            <p className="flex gap-1 text-sm">
                              <span className="font-bold">
                                Cylinder Returned:
                              </span>
                              {gasItem.gasNewRequests.isCylinderReturned
                                ? "Yes"
                                : "No"}
                            </p>
                          )}
                          <p className="flex gap-1 text-sm">
                            <span className="font-bold">Gas Quantity:</span>
                            {gasItem.gasNewRequests?.gasQuantity ||
                              gasItem.gasRefillRequests?.gasQuantity ||
                              "N/A"}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>

            <Link
              size="sm"
              className="cursor-pointer"
              href={`${PathsEnum.TOKEN}${
                customer === CustomerTypeEnum.INDIVIDUAL
                  ? PathsEnum.INDIVIDUAL
                  : PathsEnum.ORGANIZATION
              }/${
                customer === CustomerTypeEnum.INDIVIDUAL
                  ? activeGasRequests[0]?._id
                  : activeOrgGasRequests[0]?._id
              }`}
            >
              View
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyToken;

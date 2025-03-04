import { SquareCheck } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import GasRequestTypeEnum from "../../constant/gasRequestTypeEnum";
import PathsEnum from "../../constant/pathsEnum";
import useApiFetch from "../../hooks/useApiFetch";
import useGetIndividualGasRequest from "../../hooks/useGetIndividualGasRequest";
import { IIndividualCustomerGasRequest } from "../../type/IGasRequest";
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

const VerifyToken = () => {
  const {
    data: tokenData,
    postData,
    isLoading,
    error,
  } = useApiFetch<Partial<IIndividualCustomerGasRequest>>({
    url: "/token/check",
    options: {
      method: "post",
    },
  });

  const { data: activeGasRequests, fetchData } = useGetIndividualGasRequest({});

  const { register, handleSubmit } = useForm<IToken>();

  const onSubmit: SubmitHandler<IToken> = async (data) => {
    const res = (await postData(data)) as IIndividualCustomerGasRequest;
    await fetchData({
      tokenId: (res?.tokenId as IToken)?._id,
    });
  };

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
              <p className="flex gap-1 text-sm">
                <span className="font-bold">Gas Type:</span>
                {(tokenData?.gas?.type as IGasType).name || "N/A"}
              </p>
              <p className="flex gap-1 text-sm">
                <span className="font-bold">Request Type:</span>
                {tokenData?.gas?.requestType || "N/A"}
              </p>
              {tokenData?.gas?.requestType ===
                GasRequestTypeEnum.Refilled_Gas && (
                <p className="flex gap-1 text-sm">
                  <span className="font-bold">Cylinder Returned:</span>
                  {tokenData?.gas?.isCylinderReturned ? "Yes" : "No"}
                </p>
              )}
              <p className="flex gap-1 text-sm">
                <span className="font-bold">Gas Quantity:</span>
                {tokenData?.gas?.gasQuantity || "N/A"}
              </p>
            </div>

            <Link
              size="sm"
              className="cursor-pointer"
              href={`${PathsEnum.TOKEN}/${activeGasRequests[0]._id}`}
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

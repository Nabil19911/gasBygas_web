import { SquareCheck } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import useApiFetch from "../../hooks/useApiFetch";
import { IIndividualCustomerGasRequest } from "../../type/IGasRequest";
import IToken from "../../type/IToken";
import Banner from "../ui-components/banner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { Button, Link, TextInput } from "../ui-components/form-fields";
import GasRequestTypeEnum from "../../constant/gasRequestTypeEnum";

const VerifyToken = () => {
  const {
    data: tokenData,
    postData,
    error,
  } = useApiFetch<Partial<IIndividualCustomerGasRequest>>({
    url: "/token/check",
    options: {
      method: "post",
    },
  });

  const { register, handleSubmit } = useForm<IToken>();

  const onSubmit: SubmitHandler<IToken> = async (data) => {
    await postData(data as any);
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
                {tokenData?.gas?.type || "N/A"}
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
            <Link>View</Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyToken;

import { Route, SquareCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { Button, TextInput } from "../ui-components/form-fields";
import useApiFetch from "../../hooks/useApiFetch";
import { SubmitHandler, useForm } from "react-hook-form";
import IToken from "../../type/IToken";
import Banner from "../ui-components/banner";

const VerifyToken = () => {
  const {
    data: tokenData,
    postData,
    error,
  } = useApiFetch<IToken>({
    url: "/token/check",
    options: {
      method: "get",
    },
  });

  const { register, handleSubmit } = useForm<IToken>();

  const onSubmit: SubmitHandler<IToken> = async (data) => {
    await postData(data);
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
          <p className="font-bold text-sm">Token: {tokenData.token || ""}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyToken;

import { DiamondPlus } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PathsEnum from "../../constant/pathsEnum";
import useApiFetch from "../../hooks/useApiFetch";
import ICustomer from "../../type/ICustomer";
import GasRequestModal from "../modal/GasRequestModal";
import Banner from "../ui-components/banner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";
import { Button, Link, TextInput } from "../ui-components/form-fields";
import useGetIndividualGasRequest from "../../hooks/useGetIndividualGasRequest";
import IToken from "../../type/IToken";

interface ISearch {
  email: string;
}

const CustomerRequestGasByOutlet = () => {
  const [isStockModalOpen, setStockModalOpen] = useState(false);
  const {
    data: user,
    postData,
    error,
  } = useApiFetch<Partial<ICustomer>>({
    url: "/user",
  });

  const { data: gasRequest, fetchData } = useGetIndividualGasRequest({
    userId: user?._id,
  });

  const { register, handleSubmit } = useForm<ISearch>();

  const onSubmit: SubmitHandler<ISearch> = async (data) => {
    await postData(data);
  };

  const existToken = gasRequest.find(
    (re) => (re.userId as unknown as ICustomer)?._id === user?._id
  );

  return (
    <Card>
      <GasRequestModal
        user={user!}
        isOpen={isStockModalOpen}
        closeModal={() => setStockModalOpen(false)}
        fetchData={fetchData}
      />
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            <DiamondPlus className="mr-2 h-5 w-5" />
            Customer Request Gas
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center flex-initial w-full gap-2"
          >
            <div>
              <TextInput
                placeholder="Search by Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
              />
            </div>
            <div>
              <Button size="sm" type="submit">
                Search
              </Button>
            </div>
          </form>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <Banner type="error">{error}</Banner>}
        {existToken && (
          <Banner type="error">gas request already pending</Banner>
        )}

        {!user ? (
          <div className="flex items-center justify-center mt-2 gap-2">
            <p>Add new user</p>

            <Link size="sm" href={`${PathsEnum.CUSTOMER}/${PathsEnum.CREATE}`}>
              Create one
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 items-center">
            <div className="flex flex-col">
              <p>{user.business_type}</p>
              {existToken && (
                <p className="font-bold text-sm">
                  Token: {(existToken.tokenId as IToken)?.token || ""}
                </p>
              )}
            </div>

            <Button
              size="sm"
              onClick={() => setStockModalOpen(true)}
              disabled={!!existToken}
            >
              Request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerRequestGasByOutlet;

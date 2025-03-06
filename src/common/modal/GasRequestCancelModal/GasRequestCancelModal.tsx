import { SubmitHandler, useForm } from "react-hook-form";
import DeliveryStatusEnum from "../../../constant/DeliveryStatusEnum";
import useApiFetch from "../../../hooks/useApiFetch";
import { IIndividualCustomerGasRequest } from "../../../type/IGasRequest";
import Banner from "../../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../ui-components/card/Card";
import { Button, Textarea } from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";

interface IGasRequestCancelModalProps {
  activeGasRequestId: string;
  isOpen: boolean;
  closeModal: () => void;
}

const GasRequestCancelModal = ({
  activeGasRequestId,
  isOpen,
  closeModal,
}: IGasRequestCancelModalProps) => {
  const {
    postData: updateGasRequest,
    isLoading,
    error,
  } = useApiFetch<Partial<IIndividualCustomerGasRequest>>({
    url: `/gas-request/individual/${activeGasRequestId}`,
    options: { method: "delete" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IIndividualCustomerGasRequest>();

  const onSubmit: SubmitHandler<IIndividualCustomerGasRequest> = async (
    data
  ) => {
    const saveData = {
      ...data,
      status: DeliveryStatusEnum.Cancelled,
    };

    updateGasRequest(saveData);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Add Stock">
      <Card className="w-full max-w-2xl mx-auto">
        {isLoading && <LoadingSpinner />}
        <CardHeader>
          <CardDescription>Fill in the Stock details below.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <Banner type="error">{error}</Banner>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Textarea
              label="Description"
              {...register("comment", { required: "Please Fill The reason" })}
              error={errors.comment?.message}
            />
            <Button
              type="submit"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default GasRequestCancelModal;

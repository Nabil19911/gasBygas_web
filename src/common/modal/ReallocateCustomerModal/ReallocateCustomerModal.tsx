import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useApiFetch from "../../../hooks/useApiFetch";
import ICustomer from "../../../type/ICustomer";
import { IIndividualCustomerGasRequest } from "../../../type/IGasRequest";
import IToken from "../../../type/IToken";
import { Card, CardContent } from "../../ui-components/card/Card";
import { Button, Select, Textarea } from "../../ui-components/form-fields";
import Modal from "../../ui-components/modal/Modal";

interface IReallocateCustomerModalProps {
  isOpen: boolean;
  closeModal: () => void;
  activeGasRequests: IIndividualCustomerGasRequest[];
  currentCustomerId: string;
  fetchData: () => Promise<void>;
}

const ReallocateCustomerModal = ({
  isOpen,
  closeModal,
  activeGasRequests,
  currentCustomerId,
  fetchData,
}: IReallocateCustomerModalProps) => {
  const { register, handleSubmit } =
    useForm<Partial<IIndividualCustomerGasRequest>>();

  const {
    postData: updateGasRequest,
    isLoading: isReallocationLoading,
    error,
  } = useApiFetch<Partial<IIndividualCustomerGasRequest>>({
    url: `/gas-request/individual/reallocate-customer`,
    options: { method: "patch" },
  });

  const customerOption = useMemo(() => {
    return activeGasRequests
      .filter((activeGasRequest) => !activeGasRequest.tokenId)
      .map((item) => {
        const customer = item.userId as ICustomer;
        return {
          label:
            `${customer.individual_details?.first_name} ${customer.individual_details?.last_name}` ||
            "",
          value: customer._id || "",
        };
      });
  }, [activeGasRequests]);

  const onSubmit: SubmitHandler<
    Partial<IIndividualCustomerGasRequest>
  > = async (data) => {
    const activeToken = (
      activeGasRequests.find(
        (item) => (item.userId as ICustomer)._id === currentCustomerId
      )?.tokenId as IToken
    )._id;

    const saveData = {
      comment: data.comment,
      activeToken,
      selectedCustomerId: data.userId,
      currentCustomerId,
    };

    await updateGasRequest(saveData);

    await fetchData();
    if (!isLoading && !error) {
      closeModal();
    }
  };
  const isLoading = isReallocationLoading;
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Reallocate Customer"
      className="w-lg"
    >
      {/* {isLoading && <LoadingSpinner />}
      {error && <Banner type="error">{error}</Banner>} */}
      <Card className="w-full max-w-2xl mx-auto p-4">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Select
              label="Select Customer"
              {...register("userId", {
                required: true,
              })}
              options={customerOption}
            />
            <Textarea
              label="Comments (Optional)"
              placeholder="Enter reason for reallocation"
              {...register("comment")}
            />

            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
              <Button
                onClick={closeModal}
                disabled={isLoading}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Close
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ReallocateCustomerModal;

import { SubmitHandler, useForm } from "react-hook-form";
import useApiFetch from "../../hooks/useApiFetch";
import IStock from "../../type/IStock";
import Banner from "../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui-components/card/Card";
import { Button, TextInput } from "../ui-components/form-fields";
import LoadingSpinner from "../ui-components/loadingSpinner";
import Modal from "../ui-components/modal/Modal";

interface IStockModalProps {
  isOpen: boolean;
  closeModal: () => void;
  stock: IStock;
}

const StockModal = ({ stock, isOpen, closeModal }: IStockModalProps) => {
  const {
    postData: updateStock,
    isLoading,
    error,
  } = useApiFetch<IStock>({
    url: `/stock/update/${stock._id}`,
    options: {
      method: "put",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IStock>();

  const onSubmit: SubmitHandler<IStock> = async (data) => {
    await updateStock(data);
    if (!isLoading) {
      closeModal();
    }
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
            <TextInput
              label="Current Stock"
              error={errors.currentStock?.message}
              {...register("currentStock", {
                required: "First Name is required",
              })}
              type="number"
            />
            <TextInput
              label="maximum Capacity"
              error={errors.maximumCapacity?.message}
              {...register("maximumCapacity", {
                required: "Last Name is required",
              })}
              type="number"
            />
            <TextInput
              label="minimum Threshold"
              error={errors.minimumThreshold?.message}
              {...register("minimumThreshold", {
                required: "Contact is required",
              })}
              type="number"
            />
            <div className="flex justify-end space-x-4">
              <Button type="submit">Save</Button>
              <Button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-400"
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

export default StockModal;

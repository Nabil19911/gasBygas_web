import { SubmitHandler, useForm } from "react-hook-form";
import gasTypeOption from "../../../constant/gasTypeOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import IStock from "../../../type/IStock";
import Banner from "../../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../ui-components/card/Card";
import { Button, TextInput } from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";

interface IStockModalProps {
  isOpen: boolean;
  closeModal: () => void;
  stock: IStock;
  fetchStock: () => Promise<void>;
}

const StockModal = ({
  stock,
  isOpen,
  fetchStock,
  closeModal,
}: IStockModalProps) => {
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

  const { register, handleSubmit, reset, watch } = useForm<IStock>();

  const onSubmit: SubmitHandler<IStock> = async (data) => {
    await updateStock(data);
    await fetchStock();
    if (!isLoading && !error) {
      reset();
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
            {gasTypeOption.map((gasType, gasIndex) => {
              const maxValue = stock?.stock
                ? stock?.stock[gasIndex]?.maximumCapacity
                : 0;

              const currentStock = stock?.stock
                ? stock?.stock[gasIndex]?.currentStock
                : 0;
              return (
                <div key={gasIndex} className="grid grid-cols-4 gap-4">
                  <TextInput
                    label={`Gas Type ${gasIndex + 1}`}
                    disabled
                    value={gasType.value}
                    {...register(`stock.${gasIndex}.gasType`, {})}
                  />

                  <TextInput
                    label="Maximum Capacity"
                    type="number"
                    defaultValue={maxValue}
                    {...register(`stock.${gasIndex}.maximumCapacity`, {})}
                  />
                  <TextInput
                    label="Minimum Threshold"
                    type="number"
                    defaultValue={
                      stock?.stock
                        ? stock?.stock[gasIndex]?.minimumThreshold
                        : 0
                    }
                    {...register(`stock.${gasIndex}.minimumThreshold`, {})}
                  />
                  <TextInput
                    label={`Current Stock - ${currentStock}`}
                    type="number"
                    {...register(`stock.${gasIndex}.currentStock`, {})}
                    max={watch(`stock.${gasIndex}.maximumCapacity`) || maxValue}
                  />
                </div>
              );
            })}
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

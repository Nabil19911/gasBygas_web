import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetGasTypes from "../../../hooks/useGetGasTypes";
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
import GasTypeModal from "../GasTypeModal";

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
  const [isGasTypeModalOpen, setIsGasTypeModalOpen] = useState(false);
  const [gasTypeId, setGasTypeId] = useState<string>();

  const {
    postData: updateStock,
    isLoading,
    error,
  } = useApiFetch<IStock>({
    url: `/stock/${stock._id || ""}`,
    options: {
      method: stock._id ? "put" : "post",
    },
  });

  const {
    data: gasTypeData,
    isLoading: isGasTypeLoading,
    error: errorInGasType,
    fetchData: refetchGasType,
  } = useGetGasTypes();

  const { register, handleSubmit, reset, watch } = useForm<IStock>();

  const onSubmit: SubmitHandler<IStock> = async (data) => {
    await updateStock(data);
    await fetchStock();
    if (!isLoading && !error) {
      reset();
      closeModal();
    }
  };

  const hasNoGasType = gasTypeData?.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Add Stock"
      className="w-full max-w-2xl"
    >
      <GasTypeModal
        isOpen={isGasTypeModalOpen}
        gasTypeId={gasTypeId}
        closeModal={() => setIsGasTypeModalOpen(false)}
        refetchGasType={refetchGasType}
      />
      <Card className="w-full max-w-2xl mx-auto">
        {isLoading && isGasTypeLoading && <LoadingSpinner />}
        <CardHeader>
          {!hasNoGasType && (
            <CardDescription>Fill in the Stock details below.</CardDescription>
          )}
          <Button size="sm" onClick={() => setIsGasTypeModalOpen(true)}>
            Add Gas Type
          </Button>
        </CardHeader>
        {!hasNoGasType && (
          <CardContent>
            {error && <Banner type="error">{error}</Banner>}
            {errorInGasType && <Banner type="error">{errorInGasType}</Banner>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {gasTypeData?.map((gasType, gasIndex) => {
                const maxValue = stock?.stock
                  ? stock?.stock[gasIndex]?.maximumCapacity
                  : 0;

                const currentStock = stock?.stock
                  ? stock?.stock[gasIndex]?.currentStock
                  : 0;
                return (
                  <div key={gasIndex} className="grid grid-cols-5 gap-6">
                    <div className="flex items-center">
                      <p
                        {...register(`stock.${gasIndex}.gasType`, {
                          value: gasType._id,
                        })}
                      >
                        {gasType.name}
                      </p>
                    </div>

                    <TextInput
                      label="Max Capacity"
                      type="number"
                      disabled={hasNoGasType}
                      defaultValue={maxValue}
                      {...register(`stock.${gasIndex}.maximumCapacity`, {})}
                    />
                    <TextInput
                      label="Min Threshold"
                      type="number"
                      disabled={hasNoGasType}
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
                      disabled={hasNoGasType}
                      {...register(`stock.${gasIndex}.currentStock`, {})}
                      max={
                        watch(`stock.${gasIndex}.maximumCapacity`) || maxValue
                      }
                    />
                    <div className="flex items-end">
                      <Button type="button" size="sm" onClick={() => {
                        setIsGasTypeModalOpen(true)
                        setGasTypeId(gasType._id)
                      }}>
                        Edit
                      </Button>
                    </div>
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
        )}
      </Card>
    </Modal>
  );
};

export default StockModal;

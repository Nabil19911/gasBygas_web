import { useForm } from "react-hook-form";
import useApiFetch from "../../../hooks/useApiFetch";
import IGasType from "../../../type/IGasType";
import Banner from "../../ui-components/banner";
import { Card, CardContent } from "../../ui-components/card/Card";
import { Button, Textarea, TextInput } from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";
import useFetch from "../../../hooks/useFetch";
import { useEffect } from "react";

interface IGasTypeProps {
  isOpen: boolean;
  gasTypeId?: string;
  closeModal: () => void;
  refetchGasType: () => Promise<void>;
}

const GasTypeModal = ({
  isOpen,
  gasTypeId,
  closeModal,
  refetchGasType,
}: IGasTypeProps) => {
  const {
    postData: addGasType,
    isLoading,
    error,
  } = useApiFetch<IGasType>({
    url: `/gas-type/${gasTypeId}`,
    options: {
      method: gasTypeId ? "patch" : "post",
    },
  });

  const { getNewData } = useFetch<IGasType>({
    url: `/gas-type/${gasTypeId}`,
    initialLoad: true,
  });

  const { register, handleSubmit, reset } = useForm<IGasType>();

  useEffect(() => {
    const fetch = async () => {
      const res = await getNewData();
      if (res) {
        reset(res as unknown as IGasType);
      }
    };
    fetch();
  }, [gasTypeId]);

  const onSubmit = async (data: IGasType) => {
    await addGasType(data);
    await refetchGasType();
    if (!isLoading && !error) {
      reset();
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={`${gasTypeId ? "Edit" : "Add"} New Gas Type`}
    >
      <Card className="w-full max-w-2xl mx-auto">
        {isLoading && <LoadingSpinner />}
        <CardContent>
          {error && <Banner type="error">{error}</Banner>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TextInput label="Name" {...register("name", { required: true })} />
            <TextInput
              label="Price"
              type="number"
              {...register("price", { required: true })}
            />
            <Textarea
              label="Description"
              {...register("description", { required: true })}
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

export default GasTypeModal;

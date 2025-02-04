import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useApiFetch from "../../../hooks/useApiFetch";
import useFetch from "../../../hooks/useFetch";
import { getUserProfile } from "../../../store/selectors/profileSelector";
import { useAppSelector } from "../../../store/store";
import { IGasRequest, IOutlet } from "../../../type/IOutlet";
import Banner from "../../ui-components/banner";
import { Card, CardContent } from "../../ui-components/card/Card";
import {
  Button,
  CheckboxInput,
  DateTimePicker,
  TextInput,
} from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";

interface IOutletGasRequestAllowModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const OutletGasRequestAllowModal = ({
  isOpen,
  closeModal,
}: IOutletGasRequestAllowModalProps) => {
  const { data: profile } = useAppSelector(getUserProfile);
  const { data: outlet, isLoading: isOutletFetchLoading } = useFetch<IOutlet>({
    url: `/outlet/${profile?.outlet?._id}`,
    initialLoad: true,
  });
  const {
    isLoading: isOutletUpdateLoading,
    error,
    postData: updateOutlet,
  } = useApiFetch<IOutlet>({
    url: `/outlet/${profile?.outlet?._id}`,
    options: {
      method: "patch",
    },
  });

  const { register, handleSubmit, reset } = useForm<IGasRequest>();

  useEffect(() => {
    if (outlet) {
      reset(outlet.gas_request);
    }
  }, [outlet]);

  const isLoading = isOutletUpdateLoading || isOutletFetchLoading;

  const onSubmit: SubmitHandler<IGasRequest> = async (data) => {
    await updateOutlet({ ...outlet!, gas_request: data });
    if (!isLoading) {
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Allow Request Gas"
      className="w-lg"
    >
      {isLoading && <LoadingSpinner />}
      {error && <Banner type="error">{error}</Banner>}
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-5">
            <div className="mb-4">
              <DateTimePicker
                label={"Allow until"}
                id={"allow_until"}
                {...register("active_until", {})}
              />
              <div className="flex gap-2 items-center justify-center mt-4">
                <div>
                  <CheckboxInput
                    label={"Allow"}
                    id={"allow"}
                    {...register("is_allowed", {})}
                  />
                </div>
                <div className="flex-1">
                  <TextInput
                    placeholder="QTY"
                    type="number"
                    {...register("allowed_qty", {})}
                  />
                </div>
              </div>
            </div>
            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="submit">Save</Button>
              <Button
                type="button"
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

export default OutletGasRequestAllowModal;

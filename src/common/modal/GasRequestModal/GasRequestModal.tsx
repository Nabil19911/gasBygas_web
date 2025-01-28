import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import DeliveryStatusEnum from "../../../constant/DeliveryStatusEnum";
import GasRequestTypeEnum from "../../../constant/gasRequestTypeEnum";
import gasTypeOption from "../../../constant/gasTypeOptions";
import GasTypeEnum from "../../../constant/gasTypesEnum";
import RolesEnum from "../../../constant/rolesEnum";
import { requestTypeOptions } from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetOutlets from "../../../hooks/useGetOutlets";
import useGetSchedule from "../../../hooks/useGetSchedule";
import ICustomer from "../../../type/ICustomer";
import IGasRequest from "../../../type/IGasRequest";
import Banner from "../../ui-components/banner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "../../ui-components/card/Card";
import { Button, Radio, Select } from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";

interface IGasRequestModalProps {
  user: Partial<ICustomer>;
  isOpen: boolean;
  closeModal: () => void;
  fetchData: ({ userId }: { userId: string }) => Promise<void>;
}
const GasRequestModal = ({
  isOpen,
  user,
  closeModal,
  fetchData,
}: IGasRequestModalProps) => {
  const [gasRequestType, setGasRequestType] = useState<GasRequestTypeEnum>(
    GasRequestTypeEnum.Refilled_Gas
  );
  const [selectedOutlet, setSelectedOutlet] = useState<string>();

  const { data: schedules } = useGetSchedule();
  const { isLoading, error, postData } = useApiFetch<IGasRequest>({
    url: "/gas-request/create",
  });

  const { data: outlets } = useGetOutlets();

  const outletOptions = useMemo(() => {
    if (!outlets) {
      return [];
    }

    return outlets.map((outlet) => ({
      label: outlet.name,
      value: outlet._id!,
    }));
  }, [outlets]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IGasRequest>();

  const onSubmit: SubmitHandler<IGasRequest> = async (data) => {
    const saveData: IGasRequest = {
      ...data,
      userId: user?._id!,
      gas: {
        ...data.gas,
        individual: {
          type: data.gas.individual?.type as GasTypeEnum,
          requestType: data.gas.individual?.requestType!,
          gasQuantity: 1,
        },
      },
      createdBy: {
        type: user?.role as RolesEnum,
        userId: user?._id!,
      },
    };
    await postData(saveData);
    await fetchData({ userId: user?._id! });
  };

  const selectedOutletData = useMemo(
    () => outlets?.find((o) => o._id === selectedOutlet),
    [selectedOutlet, outlets]
  );

  const hasNotGasRequestEnabled: boolean = useMemo(() => {
    const selectedOutletId = selectedOutletData?._id;

    return !schedules.some((schedule) => {
      return (
        schedule?.outlets.some((it) => it.outletId === selectedOutletId) &&
        schedule?.status === DeliveryStatusEnum.OutForDelivery
      );
    });
  }, [selectedOutletData, schedules]);

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
            <Select
              label="Request Type"
              error={errors.gas?.individual?.requestType?.message}
              {...register("gas.individual.requestType", {
                required: "Please select Request Type",
                onChange: (e) => setGasRequestType(e.target.value),
              })}
              defaultValue={gasRequestType}
              options={requestTypeOptions}
              disabled={hasNotGasRequestEnabled}
            />
            <Radio
              label="Select Gas Type"
              options={gasTypeOption}
              {...register("gas.individual.type", {
                required: "Please select a gas type",
              })}
              selected={gasTypeOption[0].value}
              disabled={hasNotGasRequestEnabled}
            />
            <Select
              label="Outlet"
              error={errors.outletId?.message}
              {...register("outletId", {
                required: "Please select Outlet",
                onChange: (e) => setSelectedOutlet(e.target.value),
              })}
              options={outletOptions}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={hasNotGasRequestEnabled}
            >
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default GasRequestModal;

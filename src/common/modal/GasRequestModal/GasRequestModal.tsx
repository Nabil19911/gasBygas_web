import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import GasRequestTypeEnum from "../../../constant/gasRequestTypeEnum";
// import gasTypeOption from "../../../constant/gasTypeOptions";
import GasTypeEnum from "../../../constant/gasTypesEnum";
import RolesEnum from "../../../constant/rolesEnum";
import { requestTypeOptions } from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import useGetOutlets from "../../../hooks/useGetOutlets";
import ICustomer from "../../../type/ICustomer";
import { IIndividualCustomerGasRequest } from "../../../type/IGasRequest";
import ISelectOption from "../../../type/ISelectOption";
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
import useGetGasTypes from "../../../hooks/useGetGasTypes";

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
  const { isLoading, error, postData } =
    useApiFetch<IIndividualCustomerGasRequest>({
      url: "/gas-request/create",
    });

  const { data: outlets } = useGetOutlets();
  const { data: gasTypeData } = useGetGasTypes();

  const gasTypeOption = useMemo(() => {
    if (!gasTypeData) {
      return [];
    }

    return gasTypeData.map((gasType) => ({
      label: `${gasType.name} - ${gasType.description} - LKR ${gasType.price}`,
      value: gasType._id!,
    }));
  }, [gasTypeData]);

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
  } = useForm<IIndividualCustomerGasRequest>();

  const onSubmit: SubmitHandler<IIndividualCustomerGasRequest> = async (
    data
  ) => {
    const saveData: IIndividualCustomerGasRequest = {
      ...data,
      userId: user?._id!,
      gas: {
        ...data.gas,
        type: data.gas?.type as GasTypeEnum,
        requestType: data.gas?.requestType!,
        isCylinderReturned: false,
        gasQuantity: 1,
      },
      createdBy: user?.role as RolesEnum,
    };
    await postData(saveData);
    await fetchData({ userId: user?._id! });
  };

  const selectedOutletData = useMemo(
    () => outlets?.find((o) => o._id === selectedOutlet),
    [selectedOutlet, outlets]
  );

  const hasNotGasRequestEnabled: boolean =
    !selectedOutletData?.gas_request?.allowed_qty;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Add Stock">
      <Card className="w-full max-w-2xl mx-auto">
        {isLoading && <LoadingSpinner />}
        <CardHeader>
          <CardDescription>Fill in the Stock details below.</CardDescription>
        </CardHeader>
        <CardContent>
          {hasNotGasRequestEnabled && (
            <Banner type="warning">
              This outlet is not enabled for requests.
            </Banner>
          )}
          {outletOptions.length === 0 && (
            <Banner type="info">No Outlets available</Banner>
          )}
          {error && <Banner type="error">{error}</Banner>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Select
              label="Request Type"
              error={errors.gas?.requestType?.message}
              {...register("gas.requestType", {
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
              {...register("gas.type", {
                required: "Please select a gas type",
              })}
              selected={gasTypeData[0]?.name}
              disabled={outletOptions.length === 0}
            />
            {/* <Radio
              label="Select Gas Type"
              options={gasTypeOption}
              {...register("gas.type", {
                required: "Please select a gas type",
              })}
              selected={gasTypeOption[0].value}
              disabled={hasNotGasRequestEnabled}
            /> */}
            <Select
              label="Outlet"
              error={errors.outletId?.message}
              {...register("outletId", {
                required: "Please select Outlet",
                onChange: (e) => setSelectedOutlet(e.target.value),
              })}
              options={outletOptions as ISelectOption[]}
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

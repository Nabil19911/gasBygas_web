import { SubmitHandler, useForm } from "react-hook-form";
import useApiFetch from "../../../hooks/useApiFetch";
import { IIndividualCustomerGasRequest } from "../../../type/IGasRequest";
import Banner from "../../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
} from "../../ui-components/card/Card";
import { Button, Radio, Select } from "../../ui-components/form-fields";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Modal from "../../ui-components/modal/Modal";
import { useAppSelector } from "../../../store/store";
import { getUserProfile } from "../../../store/selectors/profileSelector";
import GasTypeEnum from "../../../constant/gasTypesEnum";
import { requestTypeOptions } from "../../../constant/selectOptions";
// import gasTypeOption from "../../../constant/gasTypeOptions";
import { useMemo, useState } from "react";
import useGetOutlets from "../../../hooks/useGetOutlets";
import GasRequestTypeEnum from "../../../constant/gasRequestTypeEnum";
import useGetSchedule from "../../../hooks/useGetSchedule";
import RolesEnum from "../../../constant/rolesEnum";
import { useNavigate } from "react-router";
import PathsEnum from "../../../constant/pathsEnum";
import useGetGasTypes from "../../../hooks/useGetGasTypes";

interface ITokenGeneratorModalProps {
  isOpen: boolean;
  savedCustomerId: string;
  closeModal: () => void;
}

const TokenGeneratorModal = ({
  isOpen,
  savedCustomerId,
  closeModal,
}: ITokenGeneratorModalProps) => {
  const [gasRequestType, setGasRequestType] = useState<GasRequestTypeEnum>(
    GasRequestTypeEnum.Refilled_Gas
  );
  const [selectedOutlet, setSelectedOutlet] = useState<string>();
  const { isLoading, error, postData } =
    useApiFetch<IIndividualCustomerGasRequest>({
      url: `/gas-request/individual`,
    });

  const navigator = useNavigate();

  const { data: profile } = useAppSelector(getUserProfile);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<IIndividualCustomerGasRequest>();

  const { data: outlets } = useGetOutlets();
  const { data: schedules } = useGetSchedule();
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
      label: `${outlet.branch_code} - ${outlet.name}`,
      value: outlet._id!,
    }));
  }, [outlets]);

  const schedule = useMemo(() => {
    const selectedOutletD = outlets.find(
      (outlet) => outlet._id === selectedOutlet
    );
    return schedules.find(
      (schedule) =>
        selectedOutletD?.full_address.district === schedule?.district
    );
  }, [schedules, profile, selectedOutlet]);

  const onSubmit: SubmitHandler<IIndividualCustomerGasRequest> = async (
    data
  ) => {
    const saveData: IIndividualCustomerGasRequest = {
      ...data,
      userId: savedCustomerId!,
      outletId:
        profile?.role === RolesEnum.ADMIN
          ? selectedOutlet!
          : profile?.outlet?._id!,
      scheduleId: schedule?._id!,
      gas: {
        ...data.gas,
        type: data.gas?.type as GasTypeEnum,
        requestType: data.gas?.requestType!,
        isCylinderReturned: false,
        gasQuantity: 1,
      },
      createdBy: profile?.role!,
    };

    const savedData = await postData(saveData);
    if (savedData) {
      reset();
      closeModal();
      navigator(PathsEnum.DASHBOARD);
    }
  };

  const selectedOutletData = useMemo(
    () => outlets?.find((o) => o._id === selectedOutlet),
    [selectedOutlet, outlets]
  );

  const hasNotGasRequestEnabled: boolean =
    !selectedOutletData?.gas_request?.allowed_qty;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Gas Request Form">
      <Card className="w-full max-w-2xl mx-auto">
        {isLoading && <LoadingSpinner />}
        <CardContent className="space-y-2">
          {hasNotGasRequestEnabled && (
            <Banner type="warning">
              This outlet is not enabled for requests.
            </Banner>
          )}
          {outletOptions.length === 0 && (
            <Banner type="info">No Outlets available</Banner>
          )}
          {error && <Banner type="error">{error}</Banner>}
          <CardDescription>Do you want to generate token</CardDescription>
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
              // disabled={hasNotGasRequestEnabled}
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
              // disabled={hasNotGasRequestEnabled}
            /> */}
            {profile?.role === RolesEnum.ADMIN && (
              <Select
                label="Outlet"
                error={errors.outletId?.message}
                {...register("outletId", {
                  required: "Please select Outlet",
                  onChange: (e) => setSelectedOutlet(e.target.value),
                })}
                options={outletOptions}
              />
            )}
            <div className="flex justify-end space-x-4">
              <Button type="submit">Yes</Button>
              <Button
                onClick={() => {
                  closeModal();
                  navigator(PathsEnum.DASHBOARD);
                }}
                className="bg-red-500 hover:bg-red-400"
              >
                No
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default TokenGeneratorModal;

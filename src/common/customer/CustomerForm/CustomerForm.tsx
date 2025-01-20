import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FileInput,
  Select,
  TextInput,
} from "../../../common/ui-components/form-fields";
import CustomerTypeEnum from "../../../constant/customerTypeEnum";
import { selectOption } from "../../../constant/customerTypeSelectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import ICustomer from "../../../type/ICustomer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui-components/card/Card";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import Banner from "../../ui-components/banner";
import { statusOptions } from "../../../constant/selectOptions";
import ActiveStatus from "../../../constant/activeStatusOptions";
import { useAppSelector } from "../../../store/store";
import { getUserProfile } from "../../../store/selectors/profileSelector";

type TCustomer = Omit<ICustomer, "password" | "confirm_password">;

const CustomerForm = () => {
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<CustomerTypeEnum>();

  const { data: userProfile } = useAppSelector(getUserProfile);

  const { isLoading, error, postData } = useApiFetch<TCustomer>({
    url: "/user/create",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCustomer>();

  const handleSelectChange = (value: CustomerTypeEnum) => {
    setSelectedBusinessType(value);

    reset({
      business_type: "",
      email: "",
      contact: "",
      full_address: {
        district: "",
        post_code: "",
        address: "",
      },
      status: ActiveStatus.ACTIVE,
      created_by: "",
      individual_details: {
        first_name: "",
        last_name: "",
        nic: "",
      },
      business_registration_certification_path: undefined,
      organization_details: {
        business_registration_number: "",
        business_name: "",
        approval_status: "",
        approval_date: "",
      },
    });
  };

  const onSubmit: SubmitHandler<TCustomer> = async (data) => {
    switch (data.business_type) {
      case CustomerTypeEnum.INDIVIDUAL:
        data.organization_details = undefined;
        data.business_registration_certification_path = undefined;
        break;
      case CustomerTypeEnum.ORGANIZATION:
        data.individual_details = undefined;
        break;
    }

    data.created_by = userProfile?.role!;
    console.log(data);
    postData(data);
  };

  const renderOptionalFields = useCallback(() => {
    switch (selectedBusinessType) {
      case CustomerTypeEnum.INDIVIDUAL:
        return (
          <>
            <TextInput
              label="First Name"
              error={errors.individual_details?.first_name?.message}
              {...register("individual_details.first_name", {
                required: "First Name is required",
              })}
            />
            <TextInput
              label="Last Name"
              error={errors.individual_details?.last_name?.message}
              {...register("individual_details.last_name", {
                required: "Last Name is required",
              })}
            />
            <TextInput
              label="NIC"
              error={errors.individual_details?.nic?.message}
              {...register("individual_details.nic", {
                required: "NIC is required",
                pattern: {
                  value: /^(?:\d{12}|\d{9}[VXvx])$/,
                  message: "Invalid NIC format.",
                },
              })}
            />
          </>
        );
      case CustomerTypeEnum.ORGANIZATION:
        return (
          <>
            <FileInput
              label="Business Register Certificate"
              error={errors?.business_registration_certification_path?.message}
              accept=".pdf,.jpg,.jpeg,.png"
              {...register("business_registration_certification_path", {
                required: "Business Register Certificate is required",
              })}
            />
            <TextInput
              label="BRN"
              error={
                errors.organization_details?.business_registration_number
                  ?.message
              }
              {...register(
                "organization_details.business_registration_number",
                {
                  required: "BRN is required",
                  pattern: {
                    value: /^(?:[A-Za-z]{2}\d{5,7}|\d{5,7})$/,
                    message:
                      "Invalid BRN format. Use the format 'PV12345' or '1234567'.",
                  },
                }
              )}
            />
          </>
        );
      default:
        return <></>;
    }
  }, [selectedBusinessType]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {isLoading && <LoadingSpinner />}
      <CardHeader>
        <CardTitle>Create Customer</CardTitle>
        <CardDescription>Fill in the customer details below.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <Banner type="error">{error}</Banner>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Business Type Selection */}
          <Select
            label="Business Type"
            error={errors.business_type?.message}
            {...register("business_type", {
              required: "Please select business type",
              onChange: (e) =>
                handleSelectChange(e.target.value as CustomerTypeEnum),
            })}
            value={selectedBusinessType}
            options={selectOption}
          />

          {/* Email Field */}
          <TextInput
            label="Email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
              disabled: !selectedBusinessType,
            })}
          />

          <Select
            label="Status"
            error={errors.status?.message}
            {...register("status", {
              required: "Please select a status",
              disabled: true,
            })}
            options={statusOptions}
            defaultValue={statusOptions[0].value}
          />

          {/* Conditional Fields Based on Business Type */}
          {renderOptionalFields()}

          {/* Contact Field */}
          <TextInput
            label="Contact"
            error={errors.contact?.message}
            {...register("contact", {
              required: "Contact is required",
              validate: (value) =>
                /^(0|0094|\+94)(7\d{8}|6\d{8})$/.test(String(value)) ||
                "Please enter a valid contact number (e.g., 0761234567 or +94761234567)",
              disabled: !selectedBusinessType,
            })}
          />

          {/* Address Fields */}
          <div className="flex flex-row gap-2">
            <TextInput
              label="District"
              error={errors.full_address?.district?.message}
              {...register("full_address.district", {
                required: "District is required",
                disabled: !selectedBusinessType,
              })}
            />
            <TextInput
              label="Post Code"
              error={errors.full_address?.post_code?.message}
              {...register("full_address.post_code", {
                required: "Post Code is required",
                validate: (value) =>
                  /^\d{5}$/.test(String(value)) ||
                  "Post Code must be exactly 5 digits",
                disabled: !selectedBusinessType,
              })}
            />
            <TextInput
              label="Address"
              error={errors.full_address?.address?.message}
              {...register("full_address.address", {
                required: "Address is required",
                disabled: !selectedBusinessType,
              })}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="submit">
              Save
            </Button>
            <Button
              type="button"
              onClick={() => reset()}
            >
              reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;

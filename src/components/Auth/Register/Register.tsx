import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FileInput,
  Select,
  TextInput,
} from "../../../common/ui-components/form-fields";
import CustomerTypeEnum from "../../../constant/customerTypeEnum";
import useAuth from "../../../hooks/useAuth";
import ISignupInputs from "../../../type/ISignupInputs";
import { selectOption } from "../../../constant/customerTypeSelectOptions";

const Register = () => {
  const { signup, isLoading } = useAuth();
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<CustomerTypeEnum>();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ISignupInputs>();

  const handleSelectChange = (value: CustomerTypeEnum) => {
    setSelectedBusinessType(value);
    reset({
      business_type: "",
      email: "",
      password: "",
      confirm_password: "",
      contact: "",
      full_address: {
        district: "",
        post_code: "",
        address: "",
      },
      status: "",
      created_by: "",
      individual_details: {
        first_name: "",
        last_name: "",
        nic: "",
      },
      organization_details: {
        business_registration_certification_path: "",
        business_registration_number: "",
        business_name: "",
        approval_status: "",
        approval_date: "",
      },
    });
  };

  const onSubmit: SubmitHandler<ISignupInputs> = async (data) => {
    await signup(data);
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
            <TextInput
              label="Business Name"
              error={errors.organization_details?.business_name?.message}
              {...register("organization_details.business_name", {
                required: "Business Name is required",
              })}
            />
            <FileInput
              label="Business Register Certificate"
              error={
                errors.organization_details
                  ?.business_registration_certification_path?.message
              }
              accept=".pdf,.jpg,.jpeg,.png"
              {...register(
                "organization_details.business_registration_certification_path",
                {
                  required: "Business Register Certificate is required",
                }
              )}
            />
            <TextInput
              label="BRN"
              error={
                errors.organization_details?.business_registration_number
                  ?.message
              }
              {...register("organization_details.business_registration_number", {
                required: "BRN is required",
                pattern: {
                  value: /^(?:[A-Za-z]{2}\d{5,7}|\d{5,7})$/,
                  message:
                    "Invalid BRN format. Use the format 'PV12345' or '1234567'.",
                },
              })}
            />
          </>
        );
      default:
        return <></>;
    }
  }, [selectedBusinessType]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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

      {renderOptionalFields()}

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

      <TextInput
        label="Password"
        error={errors.password?.message}
        type="password"
        {...register("password", {
          required: "Password is required",
          disabled: !selectedBusinessType,
        })}
      />
      <TextInput
        label="Confirm Password"
        error={errors.confirm_password?.message}
        type="password"
        {...register("confirm_password", {
          validate: (value) =>
            value === getValues("password") || "Passwords do not match",
          disabled: !selectedBusinessType,
        })}
      />

      <Button disabled={isLoading || !selectedBusinessType} type="submit">
        Register
      </Button>
    </form>
  );
};

export default Register;

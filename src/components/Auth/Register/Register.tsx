import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FileInput,
  Select,
  TextInput,
} from "../../../common/ui-components/form-fields";
import CustomerType from "../../../constant/customerType";
import useAuth from "../../../hooks/useAuth";
import ISignupInputs from "../../../type/ISignupInputs";

const selectOption = [
  { value: CustomerType.ORGANIZATION, label: "Business" },
  { value: CustomerType.INDIVIDUAL, label: "Individual" },
];

const Register = () => {
  const { signup, isLoading } = useAuth();
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<CustomerType>();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ISignupInputs>();

  const handleSelectChange = (value: CustomerType) => {
    setSelectedBusinessType(value);
    reset({
      business_type: value,
      first_name: "",
      last_name: "",
      brn: "",
      confirm_password: "",
      contact: "",
      nic: "",
      password: "",
      email: "",
      full_address: {
        address: "",
        district: "",
        post_code: "",
      },
    });
  };

  const onSubmit: SubmitHandler<ISignupInputs> = async (data) => {
    await signup(data);
  };

  const renderOptionalFields = useCallback(() => {
    switch (selectedBusinessType) {
      case CustomerType.INDIVIDUAL:
        return (
          <>
            <TextInput
              label="First Name"
              error={errors.first_name?.message}
              {...register("first_name", {
                required: "First Name is required",
              })}
            />
            <TextInput
              label="Last Name"
              error={errors.last_name?.message}
              {...register("last_name", { required: "Last Name is required" })}
            />
            <TextInput
              label="NIC"
              error={errors.nic?.message}
              {...register("nic", {
                required: "NIC is required",
                pattern: {
                  value: /^(?:\d{12}|\d{9}[VXvx])$/,
                  message: "Invalid NIC format.",
                },
              })}
            />
          </>
        );
      case CustomerType.ORGANIZATION:
        return (
          <>
            <TextInput
              label="Username"
              error={errors.username?.message}
              {...register("username", { required: "Username is required" })}
            />
            <FileInput
              label="Business Register Certificate"
              error={errors.brfile?.message}
              accept=".pdf,.jpg,.jpeg,.png"
              {...register("brfile", {
                required: "Business Register Certificate is required",
              })}
            />
            <TextInput
              label="BRN"
              error={errors.brn?.message}
              {...register("brn", {
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
        })}
        onChange={(e) => handleSelectChange(e.target.value as CustomerType)}
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
        })}
      />

      <div className="flex flex-row gap-2">
        <TextInput
          label="District"
          error={errors.full_address?.district?.message}
          {...register("full_address.district", {
            required: "District is required",
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
          })}
        />
        <TextInput
          label="Address"
          error={errors.full_address?.address?.message}
          {...register("full_address.address", {
            required: "Address is required",
          })}
        />
      </div>

      <TextInput
        label="Password"
        error={errors.password?.message}
        type="password"
        {...register("password", { required: "Password is required" })}
      />
      <TextInput
        label="Confirm Password"
        error={errors.confirm_password?.message}
        type="password"
        {...register("confirm_password", {
          validate: (value) =>
            value === getValues("password") || "Passwords do not match",
        })}
      />

      <Button disabled={isLoading} type="submit">
        Register
      </Button>
    </form>
  );
};

export default Register;

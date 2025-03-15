import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  Button,
  FileInput,
  Select,
  TextInput,
} from "../../../common/ui-components/form-fields";
import ActiveStatus from "../../../constant/activeStatusOptions";
import CustomerTypeEnum from "../../../constant/customerTypeEnum";
import DistrictsEnum from "../../../constant/districtsEnum";
import {
  customerOptions,
  districtsOptions,
  statusOptions,
} from "../../../constant/selectOptions";
import useApiFetch from "../../../hooks/useApiFetch";
import ICustomer from "../../../type/ICustomer";
import Banner from "../../ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui-components/card/Card";
import LoadingSpinner from "../../ui-components/loadingSpinner";
import TokenGeneratorModal from "../../modal/TokenGeneratorModal/TokenGeneratorModal";

type TCustomer = Omit<ICustomer, "password" | "confirm_password">;

const CustomerForm = () => {
  const navigator = useNavigate();
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<CustomerTypeEnum>();
  const [tokenGeneratorModal, setTokenGeneratorModal] = useState(false);
  const [savedCustomerId, setSavedCustomerId] = useState("");

  const { isLoading, error, postData } = useApiFetch({
    url: "/user/create",
    options: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
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
        district: "" as DistrictsEnum,
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
    const formData = new FormData();

    // Append form data only if they exist
    formData.append("business_type", data.business_type);
    formData.append("contact", data.contact);
    formData.append("email", data.email);
    formData.append("full_address", JSON.stringify(data.full_address));
    if (data.individual_details) {
      formData.append(
        "individual_details",
        JSON.stringify(data.individual_details)
      );
    }

    if (data.organization_details) {
      if (data.business_registration_certification_path) {
        let value: File | string | undefined;
        if (data.business_registration_certification_path instanceof FileList) {
          value = data.business_registration_certification_path[0];
        } else {
          value = data.business_registration_certification_path;
        }
        // Append the file only if it's defined
        if (value) {
          formData.append("business_registration_certification_path", value);
        }
      }

      formData.append(
        "organization_details",
        JSON.stringify(data.organization_details)
      );
    }
    const savedData = (await postData(formData)) as TCustomer;

    if (selectedBusinessType === CustomerTypeEnum.INDIVIDUAL && savedData) {
      setSavedCustomerId(savedData?._id!);
      setTokenGeneratorModal(true);
    }
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
        <TokenGeneratorModal
          isOpen={tokenGeneratorModal}
          savedCustomerId={savedCustomerId}
          closeModal={() => setTokenGeneratorModal(false)}
        />
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
            options={customerOptions}
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
            <Select
              label="District"
              error={errors.full_address?.district?.message}
              {...register("full_address.district", {
                required: "District is required",
                disabled: !selectedBusinessType,
              })}
              options={districtsOptions}
            />
            <TextInput
              label="Postal Code"
              error={errors.full_address?.post_code?.message}
              {...register("full_address.post_code", {
                required: "Postal Code is required",
                validate: (value) =>
                  /^\d{5}$/.test(String(value)) ||
                  "Postal Code must be exactly 5 digits",
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
            <Button type="submit">Save</Button>
            <Button
              className="bg-red-500 hover:bg-red-400"
              type="button"
              onClick={() => navigator(-1)}
            >
              Back
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;

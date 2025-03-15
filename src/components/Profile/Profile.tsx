import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Banner from "../../common/ui-components/banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../common/ui-components/card/Card";
import { Button, TextInput } from "../../common/ui-components/form-fields";
import LoadingSpinner from "../../common/ui-components/loadingSpinner";
import useApiFetch from "../../hooks/useApiFetch";
import { getUserProfile } from "../../store/selectors/profileSelector";
import { useAppDispatch, useAppSelector } from "../../store/store";
import RolesEnum from "../../constant/rolesEnum";
import {
  fetchCustomerProfileDetail,
  fetchEmployeeProfileDetail,
} from "../../store/silces/profileSlice";
import ICustomer from "../../type/ICustomer";
import CustomerTypeEnum from "../../constant/customerTypeEnum";
import IEmployee from "../../type/IEmployee";

const Profile = () => {
  const navigate = useNavigate();
  const { data: profile } = useAppSelector(getUserProfile);
  const dispatch = useAppDispatch();
  const { isLoading, error, postData } = useApiFetch({
    url: "/user/profile/update",
    options: {
      method: "patch",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<ICustomer & IEmployee>>();

  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit and view mode
  const isCustomer = profile?.role === RolesEnum.CUSTOMER;
  const isOrganization =
    profile?.business_type === CustomerTypeEnum.ORGANIZATION;
  const onSubmit: SubmitHandler<Partial<ICustomer & IEmployee>> = async (
    data
  ) => {
    let saveData;
    if (isCustomer) {
      saveData =
        profile?.business_type === CustomerTypeEnum.INDIVIDUAL
          ? {
              ...profile,
              email: data.email!,
              role: data.role,
              password: data.password,
              contact: data.contact,
              individual_details: {
                ...profile?.individual_details,
                nic: profile?.individual_details?.nic!,
                first_name: data?.individual_details?.first_name,
                last_name: data?.individual_details?.last_name,
              },
            }
          : ({
              ...profile,
              email: data.email!,
              role: data.role,
              password: data.password,
              contact: data.contact,
              organization_details: {
                business_name: data.organization_details?.business_name,
              },
            } as ICustomer);
    } else {
      saveData = {
        ...profile,
        username: data.email,
        password: data.password,
      } as IEmployee;
    }
    await postData(saveData);
    await dispatch(
      isCustomer
        ? (fetchCustomerProfileDetail(data.email!) as any)
        : fetchEmployeeProfileDetail(data.email!)
    );

    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (profile) {
      console.log(profile);
      reset(profile);
    }
  }, [profile]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {isLoading && <LoadingSpinner />}
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Edit your profile information below.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <Banner type="error">{error}</Banner>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}

          {isCustomer && (
            <div className="flex flex-col md:flex-row gap-4">
              {isOrganization ? (
                <TextInput
                  label="Business Name"
                  error={errors.first_name?.message}
                  {...register("organization_details.business_name", {
                    required: "First Name is required",
                  })}
                  disabled={!isEditing} // Disable when not in editing mode
                />
              ) : (
                <>
                  <TextInput
                    label="First Name"
                    error={errors.first_name?.message}
                    {...register("individual_details.first_name", {
                      required: "First Name is required",
                    })}
                    disabled={!isEditing} // Disable when not in editing mode
                  />
                  <TextInput
                    label="Last Name"
                    error={errors.last_name?.message}
                    {...register("individual_details.last_name", {
                      required: "Last Name is required",
                    })}
                    disabled={!isEditing}
                  />
                </>
              )}
            </div>
          )}

          {/* Contact Field */}
          {isCustomer && (
            <TextInput
              label="Contact Number"
              error={errors.contact?.message}
              {...register("contact", {
                required: "Contact number is required",
                pattern: {
                  value: /^(0|0094|\+94)(7\d{8}|6\d{8})$/,
                  message: "Invalid contact number format",
                },
              })}
              disabled={!isEditing}
            />
          )}

          {/* Password Field */}
          <TextInput
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            disabled={!isEditing} // Disable password change when not editing
          />

          {/* Buttons */}
          <div className="flex justify-between items-center">
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <Button type="submit">Save Changes</Button>
                <Button
                  className="bg-red-500 hover:bg-red-400"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Profile;

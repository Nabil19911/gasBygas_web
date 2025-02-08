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
import {
  Button,
  Select,
  TextInput,
} from "../../common/ui-components/form-fields";
import LoadingSpinner from "../../common/ui-components/loadingSpinner";
import ActiveStatus from "../../constant/activeStatusOptions";
import useApiFetch from "../../hooks/useApiFetch";
import { TProfileData } from "../../store/silces/profileSlice";
import { useAppSelector } from "../../store/store";
import { getUserProfile } from "../../store/selectors/profileSelector";

const Profile = () => {
  const navigate = useNavigate();
  const { data: profile } = useAppSelector(getUserProfile);
  const { isLoading, error, postData } = useApiFetch({
    url: "/user/update",
    options: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  // UseForm hook to handle form submission and validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TProfileData>();

  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit and view mode

  const onSubmit: SubmitHandler<TProfileData> = async (data) => {
    await postData(data);

    navigate(-1);
    // if (response) {
    //   // Navigate or show success message
    //   alert("Profile updated successfully!");
    //   setIsEditing(false); // Stop editing after success
    // }
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
          <div className="flex flex-col md:flex-row gap-4">
            <TextInput
              label="First Name"
              defaultValue="John" // Replace with the actual user's data
              error={errors.first_name?.message}
              {...register("first_name", {
                required: "First Name is required",
              })}
              disabled={!isEditing} // Disable when not in editing mode
            />
            <TextInput
              label="Last Name"
              defaultValue="Doe" // Replace with the actual user's data
              error={errors.last_name?.message}
              {...register("last_name", { required: "Last Name is required" })}
              disabled={!isEditing}
            />
          </div>

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
            })}
            disabled={!isEditing} // Disable when not editing
          />

          {/* Contact Field */}
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

          {/* Status Field (non-editable for the user) */}
          <Select
            label="Status"
            defaultValue={ActiveStatus.ACTIVE}
            {...register("status")}
            disabled={true} // Make status field read-only
            options={[
              { value: ActiveStatus.ACTIVE, label: "Active" },
              { value: ActiveStatus.INACTIVE, label: "Inactive" },
            ]}
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

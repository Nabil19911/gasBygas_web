import { useForm } from "react-hook-form";
import ActiveStatus from "../../../constant/activeStatusOptions";
import RolesEnum from "../../../constant/rolesEnum";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui-components/card/Card";
import { Button, Select, TextInput } from "../../ui-components/form-fields";

const EmployeeForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const roleOptions = Object.values(RolesEnum).map((role) => ({
    value: role,
    label: role,
  }));

  const statusOptions = Object.values(ActiveStatus).map((status) => ({
    value: status,
    label: status,
  }));

  const handleFormSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create or Edit Employee</CardTitle>
        <CardDescription>Fill in the employee details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <TextInput
            label="First Name"
            // error={errors.first_name?.message}
            {...register("first_name", {
              required: "First Name is required",
            })}
          />
          <TextInput
            label="Last Name"
            // error={errors.last_name?.message}
            {...register("last_name", {
              required: "Last Name is required",
            })}
          />
          <TextInput
            label="Contact"
            // error={errors.contact?.message}
            {...register("contact", {
              required: "Contact is required",
            })}
          />
          <TextInput
            label="Email"
            // error={errors.email?.message}
            {...register("email", {
              // required: (value) =>
              //   defaultValues.role !== roles.ADMIN || "Email is required",
            })}
          />
          <TextInput
            type="password"
            label="Password"
            // error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
            })}
          />
          <Select
            label="Role"
            // error={errors.role?.message}
            {...register("role", {
              required: "Please select a role",
            })}
            options={roleOptions}
          />
          <Select
            label="Status"
            // error={errors.status?.message}
            {...register("status", {
              required: "Please select a status",
            })}
            options={statusOptions}
          />
          <TextInput
            label="Outlet (ID)"
            // error={errors.outlet?.message}
            {...register("outlet", {
              required: "Outlet is required",
            })}
          />
          <div className="flex justify-end space-x-4">
            <Button type="submit">Save</Button>
            <Button
              type="button"
              onClick={() => reset()}
              className="bg-red-600 hover:bg-red-700"
            >
              reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;

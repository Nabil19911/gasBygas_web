import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import RolesEnum from "../../../constant/rolesEnum";
import { roleOptions, statusOptions } from "../../../constant/selectOptions";
import useGetOutlets from "../../../hooks/useGetOutlets";
import IEmployee from "../../../type/IEmployee";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui-components/card/Card";
import { Button, Select, TextInput } from "../../ui-components/form-fields";
import useApiFetch from "../../../hooks/useApiFetch";
import Banner from "../../ui-components/banner";

const EmployeeForm = () => {
  const { data: outlets } = useGetOutlets();
  const { postData: createEmployee, error } = useApiFetch<IEmployee>({
    url: "/employee/create/",
  });
  const [selectedRole, setSelectedRole] = useState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IEmployee>();

  const outletOptions = useMemo(() => {
    if (!outlets) {
      return [];
    }

    return outlets.map((outlet) => ({
      label: outlet.name,
      value: outlet._id!,
    }));
  }, [outlets]);

  const onSubmit: SubmitHandler<IEmployee> = async (data) => {
    await createEmployee(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Employee</CardTitle>
        <CardDescription>Fill in the employee details below.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <Banner type="error">{error}</Banner>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            {...register("last_name", {
              required: "Last Name is required",
            })}
          />
          <TextInput
            label="Contact"
            error={errors.contact?.message}
            {...register("contact", {
              required: "Contact is required",
            })}
          />
          <TextInput
            label="Email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
            })}
          />
          <Select
            label="Role"
            error={errors.role?.message}
            {...register("role", {
              required: "Please select a role",
              onChange: (e) => {
                setSelectedRole(e.target.value);
              },
            })}
            options={roleOptions}
          />
          <Select
            label="Status"
            error={errors.status?.message}
            {...register("status", {
              required: "Please select a status",
            })}
            options={statusOptions}
            defaultValue={statusOptions[0].value}
          />
          {selectedRole === RolesEnum.BRANCH_MANAGER && (
            <Select
              label="Outlet"
              error={errors.status?.message}
              {...register("outlet", {
                required: "Please select a status",
              })}
              options={outletOptions}
            />
          )}
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

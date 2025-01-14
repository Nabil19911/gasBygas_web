import { useForm } from "react-hook-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../ui-components/card/Card";
import { Button, Select, TextInput } from "../../ui-components/form-fields";

const OutletForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {};
  const handleSelectChange = (value: string) => {};
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Outlet</CardTitle>
        <CardDescription>
          Fill in the details to create a new outlet location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <Form {...form}> */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextInput
            label="First Name"
            // error={errors.individual_details?.first_name?.message}
            {...register("individual_details.first_name", {
              required: "First Name is required",
            })}
          />
          <TextInput
            label="First Name"
            // error={errors.individual_details?.first_name?.message}
            {...register("individual_details.first_name", {
              required: "First Name is required",
            })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="First Name"
              //   error={errors.individual_details?.first_name?.message}
              {...register("individual_details.first_name", {
                required: "First Name is required",
              })}
            />
            <TextInput
              label="First Name"
              //   error={errors.individual_details?.first_name?.message}
              {...register("individual_details.first_name", {
                required: "First Name is required",
              })}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Stock Management</h3>
            <div className="space-y-4">
              <TextInput
                label="First Name"
                // error={errors.individual_details?.first_name?.message}
                {...register("individual_details.first_name", {
                  required: "First Name is required",
                })}
              />
              <TextInput
                label="First Name"
                // error={errors.individual_details?.first_name?.message}
                {...register("individual_details.first_name", {
                  required: "First Name is required",
                })}
              />
              <TextInput
                label="First Name"
                // error={errors.individual_details?.first_name?.message}
                {...register("individual_details.first_name", {
                  required: "First Name is required",
                })}
              />
            </div>
          </div>
          <Select
            label="Business Type"
            // error={errors.business_type?.message}
            {...register("business_type", {
              required: "Please select business type",
              onChange: (e) => handleSelectChange(e.target.value as string),
            })}
            // value={selectedBusinessType}
            // options={selectOption}
            options={[]}
          />
          <div className="flex justify-end space-x-4">
            <Button type="button">Back</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Create Outlet
            </Button>
          </div>
        </form>
        {/* </Form> */}
      </CardContent>
    </Card>
  );
};

export default OutletForm;

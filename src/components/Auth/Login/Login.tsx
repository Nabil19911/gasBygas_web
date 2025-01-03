import { SubmitHandler, useForm } from "react-hook-form";
import { Button, TextInput } from "../../../common/ui-components/form-fields";
import useAuth from "../../../hooks/useAuth";
import ISigninInputs from "../../../type/ISigninInputs";

const Login = () => {
  const { signin, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISigninInputs>();

  const onSubmit: SubmitHandler<ISigninInputs> = async (data) => {
    const { username, password } = data;
    await signin({ username, password });
    reset({ username: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <TextInput
        label="Username"
        error={errors.username?.message}
        {...register("username", { required: "Username is required" })}
      />
      <TextInput
        label="Password"
        error={errors.password?.message}
        type="password"
        {...register("password", { required: "Password is required" })}
      />

      <Button disabled={isLoading} type="submit">
        Login
      </Button>
    </form>
  );
};

export default Login;

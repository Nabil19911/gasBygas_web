import { SubmitHandler, useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Button, TextInput } from "../../../common/ui-components/form-fields";

type Inputs = {
  username: string;
  password: string;
};

const Login = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { username, password } = data;
    await login(username, password);
    reset({ username: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Username"
        error={errors.username?.message}
        {...register("username", { required: "Username is required" })}
      />
      <TextInput
        label="Password"
        error={errors.password?.message}
        {...register("password", { required: "Password is required" })}
      />

      <Button type="submit">Login</Button>
    </form>
  );
};

export default Login;

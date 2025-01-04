import { SubmitHandler, useForm } from "react-hook-form";
import Banner from "../../../common/ui-components/banner";
import { Button, TextInput } from "../../../common/ui-components/form-fields";
import useAuth from "../../../hooks/useAuth";
import ISigninInputs from "../../../type/ISigninInputs";
import useIsEmployeeRoute from "../../../hooks/useIsEmployeeRoute";

const Login = () => {
  const { signin, isLoading, errorMessage, setErrorMessage } = useAuth();
  const isEmployee = useIsEmployeeRoute();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISigninInputs>();

  const onInputChange = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const onSubmit: SubmitHandler<ISigninInputs> = async (data) => {
    const { username, email, password } = data;
    await signin({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {errorMessage && <Banner type="error">{errorMessage}</Banner>}
      <TextInput
        label={isEmployee ? "Username" : "Email"}
        error={errors[isEmployee ? "username" : "email"]?.message}
        {...register(isEmployee ? "username" : "email", {
          required: isEmployee ? "Username is required" : "Email is required",
          ...(isEmployee
            ? {} // No additional validation for username
            : {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              }),
          onChange: onInputChange,
        })}
      />
      <TextInput
        label="Password"
        error={errors.password?.message}
        type="password"
        {...register("password", {
          required: "Password is required",
          onChange: onInputChange,
        })}
      />

      <Button disabled={isLoading} type="submit">
        Login
      </Button>
    </form>
  );
};

export default Login;

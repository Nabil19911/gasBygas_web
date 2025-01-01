import clsx from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, ITextInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        {label && <label htmlFor="text_input">{label}</label>}
        <input
          id={"text_input"}
          {...props}
          ref={ref}
          className={clsx(
            "w-full px-4 py-2 border rounded-lg focus:outline-none",
            {
              "border-red-600": error,
              "border-gray-300": !error,
            }
          )}
        />
        <small className="text-red-600">{error}</small>
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;

import clsx from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const TextInput = forwardRef<HTMLInputElement, ITextInputProps>(
  ({ label, error, helperText, ...props }, ref) => {
    return (
      <div>
        {label && <label htmlFor={`text_input_${label}`} className="text-nowrap">{label}</label>}
        <input
          id={`text_input_${label}`}
          {...props}
          ref={ref}
          autoComplete="off"
          className={clsx(
            "w-full px-4 py-2 border rounded-lg focus:outline-none",
            {
              "border-red-600": error,
              "border-gray-300": !error,
            }
          )}
        />

        {/* Helper Text */}
        {helperText && !error && (
          <small className="text-gray-500 text-sm">{helperText}</small>
        )}

        {error && <small className="text-red-600">{error}</small>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;

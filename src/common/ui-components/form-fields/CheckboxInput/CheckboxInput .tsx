import clsx from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

interface ICheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const CheckboxInput = forwardRef<HTMLInputElement, ICheckboxInputProps>(
  ({ label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={props.id}
          {...props}
          ref={ref}
          className={clsx(
            "w-5 h-5 text-blue-600 rounded focus:ring focus:ring-blue-300",
            {
              "border-red-600": error,
              "border-gray-300": !error,
            }
          )}
        />
        {label && (
          <label htmlFor={props.id} className="text-gray-700">
            {label}
          </label>
        )}

        {/* Error & Helper Text */}
        <div className="ml-2">
          {helperText && !error && (
            <small className="text-gray-500 text-sm">{helperText}</small>
          )}
          {error && <small className="text-red-600">{error}</small>}
        </div>
      </div>
    );
  }
);

CheckboxInput.displayName = "CheckboxInput";

export default CheckboxInput;

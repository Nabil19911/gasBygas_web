import clsx from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

interface IRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
  helperText?: string;
}

const Radio = forwardRef<HTMLInputElement, IRadioProps>(
  ({ label, options, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        {/* Radio Options */}
        <div className="space-y-2">
          {options.map((option, index) => (
            <label
              key={index}
              className={clsx("flex items-center space-x-2 cursor-pointer", {
                "text-red-600": error,
                "text-gray-700": !error,
              })}
            >
              <input
                type="radio"
                value={option.value}
                ref={ref}
                {...props}
                className={clsx(
                  "h-4 w-4 border-gray-300 focus:ring-indigo-500",
                  {
                    "border-red-600 focus:ring-red-500": error,
                    "border-gray-300 focus:ring-indigo-500": !error,
                  }
                )}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>

        {/* Helper Text */}
        {helperText && !error && (
          <small className="text-gray-500 text-sm">{helperText}</small>
        )}

        {/* Error Message */}
        {error && <small className="text-red-600 text-sm">{error}</small>}
      </div>
    );
  }
);

Radio.displayName = "RadioField";

export default Radio;

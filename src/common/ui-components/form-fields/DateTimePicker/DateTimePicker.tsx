import clsx from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

interface IDateTimePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const DateTimePicker = forwardRef<HTMLInputElement, IDateTimePickerProps>(
  ({ label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor="datetime_picker"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id="datetime_picker"
          type="datetime-local"
          {...props}
          ref={ref}
          className={clsx(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
            {
              "border-red-600 focus:ring-red-500": error,
              "border-gray-300": !error,
            }
          )}
        />

        {/* Helper Text */}
        {helperText && !error && (
          <small className="block mt-1 text-gray-500 text-sm">
            {helperText}
          </small>
        )}

        {/* Error Message */}
        {error && (
          <small className="block mt-1 text-red-600 text-sm">{error}</small>
        )}
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";

export default DateTimePicker;

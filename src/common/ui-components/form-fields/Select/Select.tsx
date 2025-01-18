import clsx from "clsx";
import { forwardRef, SelectHTMLAttributes } from "react";
import ISelectOption from "../../../../type/ISelectOption";

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: ISelectOption[];
}

const Select = forwardRef<HTMLSelectElement, ISelectProps>(
  ({ label, error, helperText, options, ...props }, ref) => {
    return (
      <div>
        {label && <label htmlFor="select_input">{label}</label>}
        <select
          id="select_input"
          ref={ref}
          defaultValue=""
          onChange={props.onChange}
          {...props}
          className={clsx(
            "w-full px-4 py-2 border rounded-lg focus:outline-none",
            {
              "border-red-600": error,
              "border-gray-300": !error,
            }
          )}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Helper Text */}
        {helperText && !error && (
          <small className="text-gray-500 text-sm">{helperText}</small>
        )}

        {error && <small className="text-red-600">{error}</small>}
      </div>
    );
  }
);

Select.displayName = "SelectInput";

export default Select;

import clsx from "clsx";
import { forwardRef, TextareaHTMLAttributes } from "react";

interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, ITextareaProps>(
  ({ label, error, helperText, ...props }, ref) => {
    return (
      <div>
        {/* Label */}
        {label && <label htmlFor={`textarea_input_${label}`}>{label}</label>}

        {/* Textarea */}
        <textarea
          id={`textarea_input_${label}`}
          {...props}
          ref={ref}
          className={clsx(
            "w-full h-64 px-4 py-2 border rounded-lg focus:outline-none",
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

        {/* Error Message */}
        {error && <small className="text-red-600">{error}</small>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;

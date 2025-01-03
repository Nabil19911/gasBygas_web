import clsx from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

interface IFileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FileInput = forwardRef<HTMLInputElement, IFileInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        {label && <label htmlFor="file_input">{label}</label>}
        <input
          id={"file_input"}
          type="file"
          {...props}
          ref={ref}
          className={clsx(
            "w-full px-4 py-2 border rounded-lg focus:outline-none cursor-pointer",
            {
              "border-red-600": error,
              "border-gray-300": !error,
            }
          )}
        />
        {error && <small className="text-red-600">{error}</small>}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export default FileInput;
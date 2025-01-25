import { ButtonHTMLAttributes, forwardRef } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"; // Add size prop
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, size = "md", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-2 text-sm", // Small button styles
      md: "px-5 py-3 text-base", // Medium button styles (default)
      lg: "px-7 py-4 text-lg", // Large button styles
    };

    return (
      <button
        {...props}
        ref={ref}
        className={`w-full bg-button_color text-white font-semibold rounded-lg shadow-md 
                   hover:bg-button_color focus:outline-none focus:ring-2 focus:ring-button_color 
                   focus:ring-offset-2 active:bg-button_color disabled:opacity-50 
                   disabled:cursor-not-allowed transition duration-200 ease-in-out 
                   ${sizeClasses[size]} ${className}`}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

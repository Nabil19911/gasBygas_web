import { ButtonHTMLAttributes, forwardRef } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md 
                 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 
                 focus:ring-offset-2 active:bg-blue-700 disabled:opacity-50 
                 disabled:cursor-not-allowed transition duration-200 ease-in-out"
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

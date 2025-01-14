import { ButtonHTMLAttributes, forwardRef } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={`w-full px-6 py-3 bg-button_color text-white font-semibold rounded-lg shadow-md 
                 hover:bg-button_color focus:outline-none focus:ring-2 focus:ring-button_color 
                 focus:ring-offset-2 active:bg-button_color disabled:opacity-50 
                 disabled:cursor-not-allowed transition duration-200 ease-in-out ${props.className}`}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

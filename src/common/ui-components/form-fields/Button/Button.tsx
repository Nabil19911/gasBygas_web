import { ButtonHTMLAttributes, forwardRef } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={`w-full px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md 
                 hover:bg-black focus:outline-none focus:ring-2 focus:ring-black 
                 focus:ring-offset-2 active:bg-black disabled:opacity-50 
                 disabled:cursor-not-allowed transition duration-200 ease-in-out ${props.className}`}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

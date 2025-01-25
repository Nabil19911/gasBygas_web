import { AnchorHTMLAttributes, forwardRef } from "react";

interface ILinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "sm" | "md" | "lg";
}

const Link = forwardRef<HTMLAnchorElement, ILinkProps>(
  ({ children, size = "md", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-5 py-3 text-base",
      lg: "px-7 py-4 text-lg",
    };

    return (
      <a
        {...props}
        ref={ref}
        className={`inline-block bg-secondary_color text-black font-semibold rounded-lg shadow-md 
                   hover:bg-secondary_color focus:outline-none focus:ring-2 focus:ring-secondary_color 
                   focus:ring-offset-2 active:bg-secondary_color disabled:opacity-50 
                   disabled:cursor-not-allowed transition duration-200 ease-in-out 
                   ${sizeClasses[size]} ${className}`}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = "Link";

export default Link;

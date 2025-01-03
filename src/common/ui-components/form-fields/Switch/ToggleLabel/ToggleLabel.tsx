import clsx from "clsx";
import { ReactNode } from "react";

interface IToggleLabelProps {
  children: ReactNode;
  isActive: boolean;
}

const ToggleLabel = ({ children, isActive }: IToggleLabelProps) => {
  return (
    <span
      className={clsx(
        "relative z-10 w-1/2 text-center text-sm font-semibold transition-colors",
        isActive ? "text-white" : "text-black-400"
      )}
    >
      {children}
    </span>
  );
};

export default ToggleLabel;

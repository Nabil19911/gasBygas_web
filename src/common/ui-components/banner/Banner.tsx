import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import { ReactNode } from "react";

interface IBannerProps {
  type: "error" | "warning" | "info";
  children: ReactNode;
}

const Banner = ({ type, children }: IBannerProps) => {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <ExclamationCircleIcon className="w-6 h-6 text-red-700" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-700" />;
      case "info":
        return <InformationCircleIcon className="w-6 h-6 text-blue-700" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center px-4 py-3 rounded shadow space-x-4 border",
        {
          "bg-red-100 text-red-700 border-red-500": type === "error",
          "bg-yellow-100 text-yellow-700 border-yellow-500": type === "warning",
          "bg-blue-100 text-blue-700 border-blue-500": type === "info",
        }
      )}
    >
      {getIcon()}
      <span className="font-medium">{children}</span>
    </div>
  );
};

export default Banner;

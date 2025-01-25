import type React from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}: IModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        ref={modalRef}
        className={`relative w-auto max-w-3xl mx-auto my-6 bg-white rounded-lg shadow-lg ${className}`}
        tabIndex={-1}
      >
        <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <button
            className="p-1 ml-auto text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="relative p-6 flex-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

"use client";

import { usePathname } from "next/navigation";

import { X } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";
import { useImperativeHandle, useState } from "react";

export interface ModalRef {
  close: () => void;
}
interface ModalProps {
  title?: string;
  children: React.ReactNode;
  expectedPath: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  ref: React.RefObject<ModalRef | null>;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Modal = ({
  title,
  children,
  expectedPath,
  onClose,
  size = "md",
  ref,
}: ModalProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 400);
    setTimeout(() => {
      setIsOpen(true);
    }, 500);
  };

  useImperativeHandle(ref, () => ({
    close: handleClose,
  }));

  if (!pathname.includes(expectedPath)) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <GlassCard
        variant="strong"
        className={cn(
          "relative w-full duration-500",
          sizeClasses[size],
          isOpen
            ? "animate-in slide-in-from-bottom fade-in"
            : "animate-out slide-out-to-bottom fill-mode-forwards fade-out"
        )}
      >
        <div className="p-6">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          )}
          {children}
        </div>
      </GlassCard>
    </div>
  );
};

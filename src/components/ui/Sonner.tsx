"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  type ToasterProps,
  toast as sonner_toast,
} from "sonner";

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      richColors
      theme={theme as ToasterProps["theme"]}
      className="toaster group rounded-lg"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      {...props}
    />
  );
};

export const toast = async (
  type: "success" | "info" | "warning" | "error" | "loading",
  message: string | string[]
) => {
  if (message instanceof Array) {
    sonner_toast[type](() => (
      <ul>
        {message.map((error, index) => (
          <li key={index} className="flex items-center gap-2">
            • {error}
          </li>
        ))}
      </ul>
    ));
    return;
  }
  sonner_toast[type](message);
};

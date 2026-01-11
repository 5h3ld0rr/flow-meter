"use client";

import { Sun, Moon, User, LogOut, ArrowLeft, Copy, Check } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Button } from "../ui/Button";
import { logout } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export type HeaderProps = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  copyText?: string;
  userName?: string;
};

export const HeaderClient = ({
  title,
  subtitle,
  showBackButton,
  copyText,
  userName,
}: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleCopy = async () => {
    if (copyText) {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <GlassCard className="p-3 md:p-4 mb-4 md:mb-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0 flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg glass hover:bg-gray-100 dark:hover:bg-gray-100/5 transition-smooth shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft
                size={20}
                className="text-gray-700 dark:text-slate-300"
              />
            </button>
          )}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {subtitle}

                  {copyText && (
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Copy ID"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg glass hover:bg-gray-100 dark:hover:bg-gray-100/5 transition-smooth"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon
                size={18}
                className="md:w-5 md:h-5 text-gray-700 dark:text-slate-300"
              />
            ) : (
              <Sun
                size={18}
                className="md:w-5 md:h-5 text-gray-700 dark:text-slate-300"
              />
            )}
          </button>
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none flex items-center space-x-2 p-2 rounded-lg glass hover:bg-gray-100 dark:hover:bg-gray-100/5 transition-smooth">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 dark:from-cyan-500 dark:to-blue-500 flex items-center justify-center">
                <User size={14} className="md:w-4 md:h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 hidden sm:block">
                {userName}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass p-0">
              <DropdownMenuItem onClick={handleLogout} className="p-0">
                <Button
                  variant="ghost"
                  fullWidth
                  className="text-red-700 dark:text-red-400"
                  icon={<LogOut className="text-inherit" />}
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </GlassCard>
  );
};

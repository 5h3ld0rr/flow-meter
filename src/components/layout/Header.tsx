"use client";

import { Sun, Moon, Bell, User, LogOut } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Button } from "../ui/Button";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <GlassCard className="p-3 md:p-4 mb-4 md:mb-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
              {subtitle}
            </p>
          )}
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
          {/* Notifications */}
          <button className="p-2 rounded-lg glass hover:bg-gray-100 dark:hover:bg-gray-100/5 transition-smooth relative">
            <Bell
              size={18}
              className="md:w-5 md:h-5 text-gray-700 dark:text-slate-300"
            />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" />
          </button>
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none flex items-center space-x-2 p-2 rounded-lg glass hover:bg-gray-100 dark:hover:bg-gray-100/5 transition-smooth">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 dark:from-cyan-500 dark:to-blue-500 flex items-center justify-center">
                <User size={14} className="md:w-4 md:h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 hidden sm:block">
                Admin
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass p-0">
              <DropdownMenuItem className="p-0">
                <Button
                  variant="ghost"
                  fullWidth
                  className="text-red-700 dark:text-red-400"
                >
                  <LogOut />
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </GlassCard>
  );
}

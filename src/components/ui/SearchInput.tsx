"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "./Input";
import { Search, Loader2 } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize from URL
  const [value, setValue] = useState(searchParams.get("search") || "");

  // Debounce search update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only update if value is different from current param to avoid infinite loops/unnecessary pushes
      const currentSearch = searchParams.get("search") || "";

      if (value !== currentSearch) {
        const params = new URLSearchParams(searchParams);
        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }

        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`);
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, pathname, router, searchParams]);

  return (
    <div className={`relative w-full ${className || ""}`}>
      <Input
        type="text"
        placeholder={placeholder}
        icon={
          isPending ? (
            <Loader2 size={18} className="animate-spin text-blue-500" />
          ) : (
            <Search size={18} />
          )
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

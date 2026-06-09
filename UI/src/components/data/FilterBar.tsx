import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  onClearFilters?: () => void;
  showClearButton?: boolean;
  showSearchInput?: boolean;
}

export function FilterBar({
  searchQuery = "",
  onSearchQueryChange = () => {},
  searchPlaceholder = "Search...",
  children,
  onClearFilters,
  showClearButton = false,
  showSearchInput = true,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center">
      {/* Search Bar */}
      {showSearchInput && (
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 bg-background h-10 w-full"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Children filter selectors (e.g. division, zone dropdowns) */}
      {children && (
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          {children}
        </div>
      )}

      {/* Clear Filters Actions */}
      {showClearButton && onClearFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-10 px-3 text-muted-foreground hover:text-foreground md:w-auto"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}

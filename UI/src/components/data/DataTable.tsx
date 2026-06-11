import * as React from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Download, Settings2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";

export interface Column<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string | number>;
  onSelectedIdsChange?: (ids: Set<string | number>) => void;
  getRowId?: (item: T) => string | number;
  
  // Pagination
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
  onPageChange?: (index: number) => void;
  onPageSizeChange?: (size: number) => void;

  // Sorting
  sorting?: {
    key: string;
    direction: "asc" | "desc" | null;
  };
  onSortChange?: (key: string, direction: "asc" | "desc" | null) => void;

  // Export
  onExport?: () => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  selectable = false,
  selectedIds,
  onSelectedIdsChange,
  getRowId,
  pagination,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortChange,
  onExport,
}: DataTableProps<T>) {
  const [density, setDensity] = React.useState<"compact" | "comfortable">("comfortable");

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectedIdsChange || !getRowId) return;
    if (checked) {
      const allIds = data.map((item) => getRowId(item));
      onSelectedIdsChange(new Set(allIds));
    } else {
      onSelectedIdsChange(new Set());
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (!onSelectedIdsChange || !selectedIds) return;
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    onSelectedIdsChange(newSelected);
  };

  const isAllSelected =
    data.length > 0 && selectedIds && getRowId && data.every((item) => selectedIds.has(getRowId(item)));

  const isSomeSelected =
    data.length > 0 &&
    selectedIds &&
    getRowId &&
    data.some((item) => selectedIds.has(getRowId(item))) &&
    !isAllSelected;

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return;
    let nextDir: "asc" | "desc" | null = "asc";
    if (sorting && sorting.key === key) {
      if (sorting.direction === "asc") nextDir = "desc";
      else if (sorting.direction === "desc") nextDir = null;
    }
    onSortChange(key, nextDir);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar / Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {selectable && selectedIds && selectedIds.size > 0 && (
            <span>{selectedIds.size} of {data.length} row(s) selected</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={onExport}>
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          )}
          <Select
            value={density}
            onValueChange={(val: "compact" | "comfortable") => setDensity(val)}
          >
            <SelectTrigger className="h-8 w-[120px] bg-background">
              <Settings2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Density" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table grid */}
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map((col) => {
                const isSorted = sorting && sorting.key === (col.accessorKey as string);
                const SortIcon = isSorted
                  ? sorting.direction === "asc"
                    ? ChevronUp
                    : ChevronDown
                  : ChevronsUpDown;

                return (
                  <TableHead
                    key={col.accessorKey as string}
                    className={cn(
                      col.sortable && "cursor-pointer select-none hover:text-foreground",
                    )}
                    onClick={() => handleSort(col.accessorKey as string, col.sortable)}
                  >
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      {col.header}
                      {col.sortable && <SortIcon className="h-3.5 w-3.5 text-muted-foreground" />}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Loading items...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 p-0">
                  <EmptyState title="No items found" description="Try clearing your filters or create a new item." />
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => {
                const rowId = getRowId ? getRowId(item) : rowIndex;
                const isSelected = selectedIds && selectedIds.has(rowId);

                return (
                  <TableRow key={rowId} data-state={isSelected ? "selected" : undefined}>
                    {selectable && (
                      <TableCell className="w-12 text-center">
                        <Checkbox
                          checked={!!isSelected}
                          onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                          aria-label={`Select row ${rowId}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => {
                      const value = item[col.accessorKey as keyof T];
                      return (
                        <TableCell
                          key={col.accessorKey as string}
                          className={cn(
                            density === "compact" ? "py-1.5 px-3 h-8" : "py-3 px-4 h-11",
                            "align-middle max-w-xs truncate"
                          )}
                        >
                          {col.cell ? col.cell(item) : (value !== undefined && value !== null ? String(value) : "-")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {pagination && onPageChange && onPageSizeChange && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(val) => onPageSizeChange(Number(val))}
            >
              <SelectTrigger className="h-8 w-20 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["5", "10", "20", "50"].map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.min((pagination.pageIndex - 1) * pagination.pageSize + 1, pagination.totalCount)}-
              {Math.min(pagination.pageIndex * pagination.pageSize, pagination.totalCount)}{" "}
              of {pagination.totalCount} entries
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onPageChange(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onPageChange(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex * pagination.pageSize >= pagination.totalCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

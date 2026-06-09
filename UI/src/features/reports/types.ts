export type ReportModule =
  | "employees"
  | "doctors"
  | "visits"
  | "leaves"
  | "expenses"
  | "orders"
  | "targets"
  | "stockists"
  | "secondary_sales";

export interface ReportColumn {
  fieldName: string;
  label: string;
  dataType: "string" | "number" | "date" | "boolean" | "select";
  isVisible: boolean;
  sequenceOrder: number;
}

export type FilterOperator = "equals" | "contains" | "gt" | "lt" | "between" | "in";

export interface ReportFilter {
  fieldName: string;
  operator: FilterOperator;
  value: string; // JSON-stringified value (ranges, arrays) or raw string
}

export interface ReportSort {
  fieldName: string;
  direction: "asc" | "desc";
}

export interface ReportDefinition {
  id: string;
  name: string;
  description?: string;
  module: ReportModule;
  columns: ReportColumn[];
  filters: ReportFilter[];
  sorts: ReportSort[];
  sharingScope: "private" | "shared";
  createdByEmployeeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedReport {
  id: string;
  reportDefinition: ReportDefinition;
  name: string;
  createdBy: string; // Employee ID
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedReport {
  definitionId?: string;
  module: ReportModule;
  headers: ReportColumn[];
  rows: Record<string, any>[];
  rowCount: number;
  generatedAt: string;
}

export interface FieldMetadata {
  fieldName: string;
  label: string;
  dataType: "string" | "number" | "date" | "boolean" | "select";
  selectOptions?: Array<{ label: string; value: string }>;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  targetAmount: number;
  primaryAmount: number;
  secondaryAmount: number;
  achievementPrimaryPercent: number;
  achievementSecondaryPercent: number;
}

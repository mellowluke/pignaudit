export type UserRole = "ADMIN" | "AUDIT_MANAGER" | "AUDITOR" | "VIEWER";

export type EngagementStatus =
  | "PLANNING"
  | "FIELDWORK"
  | "REVIEW"
  | "REPORTING"
  | "COMPLETED"
  | "CANCELLED";

export type RiskRating = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type FindingStatus =
  | "OPEN"
  | "IN_REMEDIATION"
  | "AWAITING_VALIDATION"
  | "CLOSED"
  | "RISK_ACCEPTED";

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

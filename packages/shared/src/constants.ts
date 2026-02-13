export const APP_NAME = "PignAudit";

export const ENGAGEMENT_STATUS_LABELS = {
  PLANNING: "Planning",
  FIELDWORK: "Fieldwork",
  REVIEW: "Review",
  REPORTING: "Reporting",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export const RISK_RATING_LABELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
} as const;

export const FINDING_STATUS_LABELS = {
  OPEN: "Open",
  IN_REMEDIATION: "In Remediation",
  AWAITING_VALIDATION: "Awaiting Validation",
  CLOSED: "Closed",
  RISK_ACCEPTED: "Risk Accepted",
} as const;

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
  "text/csv",
  "text/plain",
] as const;

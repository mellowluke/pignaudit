const statusStyles: Record<string, string> = {
  PLANNING: "bg-blue-100 text-blue-700",
  FIELDWORK: "bg-yellow-100 text-yellow-700",
  REVIEW: "bg-purple-100 text-purple-700",
  REPORTING: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-700",
  OPEN: "bg-red-100 text-red-700",
  IN_REMEDIATION: "bg-yellow-100 text-yellow-700",
  AWAITING_VALIDATION: "bg-blue-100 text-blue-700",
  CLOSED: "bg-green-100 text-green-700",
  RISK_ACCEPTED: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  PLANNING: "Planning",
  FIELDWORK: "Fieldwork",
  REVIEW: "Review",
  REPORTING: "Reporting",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  OPEN: "Open",
  IN_REMEDIATION: "In Remediation",
  AWAITING_VALIDATION: "Awaiting Validation",
  CLOSED: "Closed",
  RISK_ACCEPTED: "Risk Accepted",
};

const riskStyles: Record<string, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${riskStyles[risk] || "bg-gray-100 text-gray-700"}`}
    >
      {risk}
    </span>
  );
}

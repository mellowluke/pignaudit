import Link from "next/link";
import {
  mockEngagements,
  mockFindings,
  getAuditYears,
  getAuditGroupLabel,
  AUDIT_GROUPS,
  type AuditGroup,
} from "@/lib/mock-data";

export default function ReportsPage({
  searchParams,
}: {
  searchParams: { year?: string };
}) {
  const years = getAuditYears();
  const selectedYear = searchParams.year ? parseInt(searchParams.year) : years[0];

  const yearEngagements = mockEngagements.filter(
    (e) => e.auditYear === selectedYear
  );
  const yearFindings = mockFindings.filter((f) =>
    yearEngagements.some((e) => e.id === f.engagementId)
  );

  // Stats for the selected year
  const totalEngagements = yearEngagements.length;
  const completedEngagements = yearEngagements.filter(
    (e) => e.status === "COMPLETED"
  ).length;
  const activeEngagements = yearEngagements.filter((e) =>
    ["PLANNING", "FIELDWORK", "REVIEW", "REPORTING"].includes(e.status)
  ).length;

  const totalFindings = yearFindings.length;
  const openFindings = yearFindings.filter(
    (f) => f.status !== "CLOSED"
  ).length;
  const closedFindings = yearFindings.filter(
    (f) => f.status === "CLOSED"
  ).length;
  const criticalFindings = yearFindings.filter(
    (f) => f.riskRating === "CRITICAL" && f.status !== "CLOSED"
  ).length;
  const highFindings = yearFindings.filter(
    (f) => f.riskRating === "HIGH" && f.status !== "CLOSED"
  ).length;
  const overdueFindings = yearFindings.filter(
    (f) => f.status !== "CLOSED" && f.dueDate < "2026-02-19"
  ).length;

  // Breakdown by audit group
  const groupStats = AUDIT_GROUPS.map((g) => {
    const groupEngagements = yearEngagements.filter(
      (e) => e.auditGroup === g.key
    );
    const groupFindings = yearFindings.filter((f) =>
      groupEngagements.some((e) => e.id === f.engagementId)
    );
    return {
      group: g,
      engagements: groupEngagements.length,
      completed: groupEngagements.filter((e) => e.status === "COMPLETED")
        .length,
      findings: groupFindings.length,
      openFindings: groupFindings.filter((f) => f.status !== "CLOSED").length,
      avgProgress: groupEngagements.length
        ? Math.round(
            groupEngagements.reduce((sum, e) => sum + e.progress, 0) /
              groupEngagements.length
          )
        : 0,
    };
  }).filter((g) => g.engagements > 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Audit Year Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Summary reports and analytics by audit year
        </p>
      </div>

      {/* Year selector */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 mr-1">
          Audit Year:
        </span>
        {years.map((y) => {
          const isActive = y === selectedYear;
          return (
            <Link
              key={y}
              href={`/reports?year=${y}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {y}
            </Link>
          );
        })}
      </div>

      {/* Year Summary Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total Engagements"
          value={totalEngagements}
          sub={`${completedEngagements} completed, ${activeEngagements} active`}
        />
        <SummaryCard
          label="Total Findings"
          value={totalFindings}
          sub={`${openFindings} open, ${closedFindings} closed`}
        />
        <SummaryCard
          label="Critical / High Open"
          value={criticalFindings + highFindings}
          sub={`${criticalFindings} critical, ${highFindings} high`}
          alert={criticalFindings > 0}
        />
        <SummaryCard
          label="Overdue Findings"
          value={overdueFindings}
          sub="Past due date and not closed"
          alert={overdueFindings > 0}
        />
      </div>

      {/* Findings by Risk */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Findings Distribution
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(
            [
              { label: "Critical", risk: "CRITICAL", color: "red" },
              { label: "High", risk: "HIGH", color: "orange" },
              { label: "Medium", risk: "MEDIUM", color: "yellow" },
              { label: "Low", risk: "LOW", color: "green" },
            ] as const
          ).map((item) => {
            const count = yearFindings.filter(
              (f) => f.riskRating === item.risk
            ).length;
            const openCount = yearFindings.filter(
              (f) => f.riskRating === item.risk && f.status !== "CLOSED"
            ).length;
            const barColors: Record<string, string> = {
              red: "bg-red-500",
              orange: "bg-orange-500",
              yellow: "bg-yellow-500",
              green: "bg-green-500",
            };
            const bgColors: Record<string, string> = {
              red: "border-red-200 bg-red-50",
              orange: "border-orange-200 bg-orange-50",
              yellow: "border-yellow-200 bg-yellow-50",
              green: "border-green-200 bg-green-50",
            };
            return (
              <div
                key={item.risk}
                className={`rounded-lg border p-4 ${bgColors[item.color]}`}
              >
                <p className="text-sm font-medium text-gray-700">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {count}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-white/60">
                    <div
                      className={`h-1.5 rounded-full ${barColors[item.color]}`}
                      style={{
                        width: `${totalFindings ? (count / totalFindings) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {openCount} open
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Group Breakdown */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Audit Group Breakdown
        </h2>
        {groupStats.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-500">
              No engagements for this audit year
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Audit Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Engagements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Findings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Open Findings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Avg Progress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {groupStats.map((gs) => (
                  <tr key={gs.group.key} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        {gs.group.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {gs.engagements}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {gs.completed} / {gs.engagements}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {gs.findings}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {gs.openFindings > 0 ? (
                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                          {gs.openFindings}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          0
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${gs.avgProgress === 100 ? "bg-green-500" : "bg-indigo-500"}`}
                            style={{ width: `${gs.avgProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {gs.avgProgress}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Engagement Status Summary */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Engagement Status Summary
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {(
            [
              { status: "PLANNING", label: "Planning", color: "bg-gray-100 text-gray-700" },
              { status: "FIELDWORK", label: "Fieldwork", color: "bg-yellow-100 text-yellow-700" },
              { status: "REVIEW", label: "Review", color: "bg-blue-100 text-blue-700" },
              { status: "REPORTING", label: "Reporting", color: "bg-purple-100 text-purple-700" },
              { status: "COMPLETED", label: "Completed", color: "bg-green-100 text-green-700" },
              { status: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-700" },
            ] as const
          ).map((item) => {
            const count = yearEngagements.filter(
              (e) => e.status === item.status
            ).length;
            return (
              <div
                key={item.status}
                className="rounded-lg border border-gray-200 bg-white p-4 text-center"
              >
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${item.color}`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engagements in year */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          All Engagements — {selectedYear}
        </h2>
        {yearEngagements.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-500">
              No engagements for this audit year
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Findings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {yearEngagements.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/engagements/${e.id}`}
                        className="block"
                      >
                        <p className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                          {e.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {e.department} &middot; {e.startDate} —{" "}
                          {e.endDate}
                        </p>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        {getAuditGroupLabel(e.auditGroup)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {e.leadAuditor}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {e.findingsCount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${e.progress === 100 ? "bg-green-500" : "bg-indigo-500"}`}
                            style={{ width: `${e.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {e.progress}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryCard({
  label,
  value,
  sub,
  alert,
}: {
  label: string;
  value: number;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        alert
          ? "border-red-200 bg-red-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p
        className={`mt-1 text-3xl font-bold ${
          alert ? "text-red-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-500">{sub}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PLANNING: "bg-gray-100 text-gray-700",
    FIELDWORK: "bg-yellow-100 text-yellow-700",
    REVIEW: "bg-blue-100 text-blue-700",
    REPORTING: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.PLANNING}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

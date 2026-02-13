import Link from "next/link";
import { dashboardStats, mockEngagements, mockFindings } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";

export default function DashboardPage() {
  const stats = dashboardStats;
  const recentEngagements = mockEngagements.slice(0, 3);
  const recentFindings = mockFindings.filter((f) => f.status !== "CLOSED").slice(0, 4);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your audit program
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Engagements"
          value={stats.activeEngagements}
          color="indigo"
        />
        <StatCard
          label="Open Findings"
          value={stats.openFindings}
          color="red"
        />
        <StatCard
          label="Critical Findings"
          value={stats.criticalFindings}
          color="orange"
        />
        <StatCard
          label="Overdue Findings"
          value={stats.overdueFindings}
          color="yellow"
        />
      </div>

      {/* Risk breakdown */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Findings by Risk Level
          </h2>
          <div className="space-y-3">
            {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((level) => {
              const count =
                stats.findingsByRisk[level as keyof typeof stats.findingsByRisk];
              const max = 7;
              const colors: Record<string, string> = {
                CRITICAL: "bg-red-500",
                HIGH: "bg-orange-500",
                MEDIUM: "bg-yellow-500",
                LOW: "bg-green-500",
              };
              return (
                <div key={level} className="flex items-center gap-3">
                  <span className="w-20 text-sm font-medium text-gray-600">
                    {level}
                  </span>
                  <div className="flex-1">
                    <div className="h-6 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-6 rounded-full ${colors[level]}`}
                        style={{ width: `${(count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-gray-900">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Engagement Pipeline
          </h2>
          <div className="space-y-3">
            {(
              ["PLANNING", "FIELDWORK", "REVIEW", "REPORTING", "COMPLETED"] as const
            ).map((status) => {
              const count =
                stats.engagementsByStatus[
                  status as keyof typeof stats.engagementsByStatus
                ];
              return (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <span className="text-sm font-semibold text-gray-900">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Engagements
            </h2>
            <Link
              href="/engagements"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEngagements.map((e) => (
              <Link
                key={e.id}
                href={`/engagements/${e.id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {e.title}
                  </p>
                  <p className="text-xs text-gray-500">{e.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={e.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Open Findings
            </h2>
            <Link
              href="/findings"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentFindings.map((f) => (
              <Link
                key={f.id}
                href={`/findings/${f.id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {f.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {f.id} &middot; Due {f.dueDate}
                  </p>
                </div>
                <RiskBadge risk={f.riskRating} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    red: "border-red-200 bg-red-50 text-red-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
    green: "border-green-200 bg-green-50 text-green-700",
  };

  return (
    <div
      className={`rounded-lg border p-5 ${colorMap[color] || "border-gray-200 bg-white"}`}
    >
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}

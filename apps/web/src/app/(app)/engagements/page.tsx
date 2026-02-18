import Link from "next/link";
import { mockEngagements } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";

const ACTIVE_STATUSES = ["PLANNING", "FIELDWORK", "REVIEW", "REPORTING"];

export default function EngagementsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  let filtered = mockEngagements;

  if (searchParams.status === "active") {
    filtered = filtered.filter((e) =>
      ACTIVE_STATUSES.includes(e.status)
    );
  } else if (searchParams.status) {
    filtered = filtered.filter((e) => e.status === searchParams.status);
  }

  const hasFilters = !!searchParams.status;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagements</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage audit engagements across your organization
          </p>
        </div>
        <Link
          href="/engagements/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <svg
            className="-ml-0.5 mr-1.5 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Engagement
        </Link>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Filtered by:</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            Status: {searchParams.status === "active" ? "Active" : searchParams.status?.replace(/_/g, " ")}
            <Link href="/engagements" className="ml-1 hover:text-indigo-900">&times;</Link>
          </span>
          <Link
            href="/engagements"
            className="text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Link>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Risk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Lead Auditor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Findings
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  No engagements match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/engagements/${e.id}`} className="block">
                      <p className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                        {e.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {e.department} &middot; {e.startDate} — {e.endDate}
                      </p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge risk={e.riskRating} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {e.leadAuditor}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${e.progress === 100 ? "bg-green-500" : "bg-indigo-500"}`}
                          style={{ width: `${e.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{e.progress}%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {e.findingsCount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

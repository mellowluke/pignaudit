import Link from "next/link";
import { mockFindings } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";

const TODAY = "2026-02-18";

export default function FindingsPage({
  searchParams,
}: {
  searchParams: { status?: string; risk?: string; overdue?: string };
}) {
  let filtered = mockFindings;

  if (searchParams.status) {
    filtered = filtered.filter((f) => f.status === searchParams.status);
  }
  if (searchParams.risk) {
    filtered = filtered.filter((f) => f.riskRating === searchParams.risk);
  }
  if (searchParams.overdue === "true") {
    filtered = filtered.filter(
      (f) => f.status !== "CLOSED" && f.dueDate < TODAY
    );
  }

  const hasFilters = searchParams.status || searchParams.risk || searchParams.overdue;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Findings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage audit findings across all engagements
        </p>
      </div>

      {/* Summary strip */}
      <div className="mb-6 flex gap-3">
        {[
          { label: "Open", count: mockFindings.filter((f) => f.status === "OPEN").length, color: "red", filter: "status=OPEN" },
          { label: "In Remediation", count: mockFindings.filter((f) => f.status === "IN_REMEDIATION").length, color: "yellow", filter: "status=IN_REMEDIATION" },
          { label: "Awaiting Validation", count: mockFindings.filter((f) => f.status === "AWAITING_VALIDATION").length, color: "blue", filter: "status=AWAITING_VALIDATION" },
          { label: "Closed", count: mockFindings.filter((f) => f.status === "CLOSED").length, color: "green", filter: "status=CLOSED" },
        ].map((s) => {
          const colors: Record<string, string> = {
            red: "border-red-200 bg-red-50 text-red-700",
            yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
            blue: "border-blue-200 bg-blue-50 text-blue-700",
            green: "border-green-200 bg-green-50 text-green-700",
          };
          const isActive = searchParams.status === s.filter.split("=")[1];
          return (
            <Link
              key={s.label}
              href={isActive ? "/findings" : `/findings?${s.filter}`}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-shadow hover:shadow-md ${colors[s.color]} ${isActive ? "ring-2 ring-offset-1 ring-gray-400" : ""}`}
            >
              <span className="text-xl font-bold">{s.count}</span>
              <span className="text-sm font-medium">{s.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Filtered by:</span>
          {searchParams.status && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              Status: {searchParams.status.replace(/_/g, " ")}
              <Link href={buildFilterUrl(searchParams, "status")} className="ml-1 hover:text-indigo-900">&times;</Link>
            </span>
          )}
          {searchParams.risk && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              Risk: {searchParams.risk}
              <Link href={buildFilterUrl(searchParams, "risk")} className="ml-1 hover:text-indigo-900">&times;</Link>
            </span>
          )}
          {searchParams.overdue === "true" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              Overdue
              <Link href={buildFilterUrl(searchParams, "overdue")} className="ml-1 hover:text-indigo-900">&times;</Link>
            </span>
          )}
          <Link
            href="/findings"
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
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Finding
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Risk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Original Due Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                  No findings match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-indigo-600">
                    <Link href={`/findings/${f.id}`}>{f.id}</Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/findings/${f.id}`} className="block">
                      <p className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                        {f.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {f.engagementTitle}
                      </p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge risk={f.riskRating} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {f.owner}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {f.dueDate}
                    {f.status !== "CLOSED" && f.dueDate < TODAY && (
                      <span className="ml-2 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Overdue
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {f.originalDueDate ? (
                      <span className="text-gray-500">{f.originalDueDate}</span>
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
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

function buildFilterUrl(
  params: { status?: string; risk?: string; overdue?: string },
  remove: string
): string {
  const remaining = Object.entries(params)
    .filter(([key, val]) => key !== remove && val)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
  return remaining ? `/findings?${remaining}` : "/findings";
}

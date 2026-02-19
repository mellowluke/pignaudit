import Link from "next/link";
import { mockEngagements, getAuditYears, getAuditGroupLabel, AUDIT_GROUPS, type AuditGroup } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";

const ACTIVE_STATUSES = ["PLANNING", "FIELDWORK", "REVIEW", "REPORTING"];

export default function EngagementsPage({
  searchParams,
}: {
  searchParams: { status?: string; year?: string; group?: string };
}) {
  let filtered = mockEngagements;

  if (searchParams.status === "active") {
    filtered = filtered.filter((e) => ACTIVE_STATUSES.includes(e.status));
  } else if (searchParams.status) {
    filtered = filtered.filter((e) => e.status === searchParams.status);
  }
  if (searchParams.year) {
    filtered = filtered.filter((e) => e.auditYear === parseInt(searchParams.year!));
  }
  if (searchParams.group) {
    filtered = filtered.filter((e) => e.auditGroup === searchParams.group);
  }

  const hasFilters = !!searchParams.status || !!searchParams.year || !!searchParams.group;
  const years = getAuditYears();

  // Group filtered results by year then group
  const grouped: Record<number, Record<AuditGroup, typeof filtered>> = {};
  for (const eng of filtered) {
    if (!grouped[eng.auditYear]) {
      grouped[eng.auditYear] = { CORPORATE_RBA: [], IS_RBA: [], MAR: [], SOC: [] };
    }
    grouped[eng.auditYear][eng.auditGroup].push(eng);
  }

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
          <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Engagement
        </Link>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-500 mr-1">Year:</span>
        {years.map((y) => {
          const isActive = searchParams.year === String(y);
          return (
            <Link
              key={y}
              href={isActive ? buildUrl(searchParams, "year") : buildUrl({ ...searchParams, year: String(y) })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {y}
            </Link>
          );
        })}
        <span className="ml-3 text-xs font-medium text-gray-500 mr-1">Group:</span>
        {AUDIT_GROUPS.map((g) => {
          const isActive = searchParams.group === g.key;
          return (
            <Link
              key={g.key}
              href={isActive ? buildUrl(searchParams, "group") : buildUrl({ ...searchParams, group: g.key })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {g.label}
            </Link>
          );
        })}
        {hasFilters && (
          <Link
            href="/engagements"
            className="ml-2 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Link>
        )}
      </div>

      {/* Grouped view */}
      {Object.entries(grouped)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, groups]) => (
          <div key={year} className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Audit Year {year}
            </h2>
            {AUDIT_GROUPS.map((g) => {
              const engagements = groups[g.key];
              if (engagements.length === 0) return null;
              return (
                <div key={g.key} className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                      {g.label}
                    </span>
                    <span className="text-xs text-gray-400">{engagements.length} audit{engagements.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Engagement</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Risk</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Lead Auditor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Progress</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Findings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {engagements.map((e) => (
                          <tr key={e.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <Link href={`/engagements/${e.id}`} className="block">
                                <p className="text-sm font-medium text-gray-900 hover:text-indigo-600">{e.title}</p>
                                <p className="text-xs text-gray-500">{e.department} &middot; {e.startDate} — {e.endDate}</p>
                              </Link>
                            </td>
                            <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                            <td className="px-6 py-4"><RiskBadge risk={e.riskRating} /></td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{e.leadAuditor}</td>
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
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{e.findingsCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {filtered.length === 0 && (
        <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500">No engagements match the current filters.</p>
        </div>
      )}
    </div>
  );
}

function buildUrl(
  params: Record<string, string | undefined>,
  remove?: string
): string {
  const entries = Object.entries(params)
    .filter(([key, val]) => key !== remove && val)
    .map(([key, val]) => `${key}=${val}`);
  return entries.length ? `/engagements?${entries.join("&")}` : "/engagements";
}

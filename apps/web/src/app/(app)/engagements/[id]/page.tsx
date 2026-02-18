import Link from "next/link";
import { mockEngagements, mockFindings } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";
import EngagementDocuments from "@/components/engagement-documents";

export default function EngagementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const engagement = mockEngagements.find((e) => e.id === params.id);

  if (!engagement) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Engagement not found</p>
      </div>
    );
  }

  const findings = mockFindings.filter(
    (f) => f.engagementTitle === engagement.title
  );

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/engagements"
          className="mb-3 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <svg
            className="mr-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Engagements
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {engagement.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {engagement.department}
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={engagement.status} />
            <RiskBadge risk={engagement.riskRating} />
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Lead Auditor</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {engagement.leadAuditor}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Timeline</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {engagement.startDate} — {engagement.endDate}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Progress</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-3 flex-1 rounded-full bg-gray-200">
              <div
                className={`h-3 rounded-full ${engagement.progress === 100 ? "bg-green-500" : "bg-indigo-500"}`}
                style={{ width: `${engagement.progress}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {engagement.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Audit Documents */}
      <div className="mb-8">
        <EngagementDocuments engagementId={engagement.id} />
      </div>

      {/* Findings */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Findings ({findings.length})
          </h2>
        </div>
        {findings.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-500">
              No findings recorded yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {findings.map((f) => (
              <Link
                key={f.id}
                href={`/findings/${f.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {f.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {f.id} &middot; Owner: {f.owner} &middot; Due: {f.dueDate}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <StatusBadge status={f.status} />
                  <RiskBadge risk={f.riskRating} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

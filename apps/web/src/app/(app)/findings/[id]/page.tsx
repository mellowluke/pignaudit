import Link from "next/link";
import { mockFindings } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";

export default function FindingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const finding = mockFindings.find((f) => f.id === params.id);

  if (!finding) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Finding not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/findings"
          className="mb-3 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Findings
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">{finding.id}</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">{finding.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{finding.engagementTitle}</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={finding.status} />
            <RiskBadge risk={finding.riskRating} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Description</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              During our review of the {finding.engagementTitle.toLowerCase()}, we identified
              that {finding.title.toLowerCase()}. This finding represents a{" "}
              {finding.riskRating.toLowerCase()} risk to the organization and requires
              remediation by the assigned owner.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Recommendation</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Management should implement appropriate controls to address this finding.
              A remediation plan should be developed and submitted for review by the
              audit team within 30 days. Progress updates should be provided on a
              bi-weekly basis until the finding is fully remediated and validated.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Activity Log</h2>
            <div className="space-y-4">
              <ActivityItem
                date={finding.dateIdentified}
                user="Sarah Chen"
                action="Finding identified and documented"
              />
              {finding.status !== "OPEN" && (
                <ActivityItem
                  date={finding.dueDate}
                  user={finding.owner}
                  action="Remediation plan submitted for review"
                />
              )}
              {finding.status === "CLOSED" && (
                <ActivityItem
                  date={finding.dueDate}
                  user="Sarah Chen"
                  action="Finding validated and closed"
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium uppercase text-gray-500">Owner</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{finding.owner}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-gray-500">Date Identified</dt>
                <dd className="mt-1 text-sm text-gray-900">{finding.dateIdentified}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-gray-500">Due Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{finding.dueDate}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-gray-500">Engagement</dt>
                <dd className="mt-1 text-sm text-indigo-600">
                  {finding.engagementTitle}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  date,
  user,
  action,
}: {
  date: string;
  user: string;
  action: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="h-2 w-2 rounded-full bg-indigo-500" />
        <div className="w-px flex-1 bg-gray-200" />
      </div>
      <div className="pb-4">
        <p className="text-sm text-gray-900">{action}</p>
        <p className="text-xs text-gray-500">
          {user} &middot; {date}
        </p>
      </div>
    </div>
  );
}

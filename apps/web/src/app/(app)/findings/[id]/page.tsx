import Link from "next/link";
import { mockFindings, mockWorkpapers, mockEngagements, type Signoff, type FollowUp } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";

const WORKFLOW_STEPS = ["DRAFT", "SUBMITTED", "REVIEWED", "APPROVED", "CLOSED"] as const;

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

  const engagement = mockEngagements.find((e) => e.id === finding.engagementId);
  const workpaper = finding.workpaperId
    ? mockWorkpapers.find((w) => w.id === finding.workpaperId)
    : null;

  const currentStepIdx = WORKFLOW_STEPS.indexOf(finding.workflowStatus);

  return (
    <div>
      {/* Header */}
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
              {workpaper && (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                  {workpaper.reference}
                </span>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">{finding.title}</h1>
            {engagement && (
              <p className="mt-1 text-sm text-gray-500">
                <Link href={`/engagements/${engagement.id}`} className="hover:text-indigo-600">
                  {engagement.title}
                </Link>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <StatusBadge status={finding.status} />
            <RiskBadge risk={finding.riskRating} />
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Workflow Progress
        </h2>
        <div className="flex items-center justify-between">
          {WORKFLOW_STEPS.map((step, i) => {
            const isCompleted = i < currentStepIdx;
            const isCurrent = i === currentStepIdx;
            return (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium ${
                      isCompleted
                        ? "text-green-700"
                        : isCurrent
                          ? "text-indigo-700"
                          : "text-gray-400"
                    }`}
                  >
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                  </span>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      i < currentStepIdx ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Description</h2>
            <p className="text-sm leading-relaxed text-gray-600">{finding.description}</p>
          </div>

          {/* Recommendation */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Recommendation</h2>
            <p className="text-sm leading-relaxed text-gray-600">{finding.recommendation}</p>
          </div>

          {/* Management Response */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Management Response</h2>
            {finding.managementResponse ? (
              <p className="text-sm leading-relaxed text-gray-600">{finding.managementResponse}</p>
            ) : (
              <p className="text-sm italic text-gray-400">Awaiting management response</p>
            )}
          </div>

          {/* Signoff Chain */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Signoff Chain</h2>
            {finding.signoffs.length === 0 ? (
              <p className="text-sm text-gray-400">No signoffs yet</p>
            ) : (
              <div className="space-y-3">
                {finding.signoffs.map((so) => (
                  <FindingSignoffRow key={so.id} signoff={so} />
                ))}
              </div>
            )}
          </div>

          {/* Follow-Ups */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Follow-Ups ({finding.followUps.length})
            </h2>
            {finding.followUps.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No follow-ups recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {finding.followUps.map((fu) => (
                  <FollowUpCard key={fu.id} followUp={fu} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Details</h2>
            <dl className="space-y-4">
              <DetailItem label="Owner" value={finding.owner} />
              <DetailItem label="Risk Rating" value={finding.riskRating} />
              <DetailItem label="Status" value={finding.status.replace(/_/g, " ")} />
              <DetailItem label="Workflow Status" value={finding.workflowStatus} />
              <DetailItem label="Date Identified" value={finding.dateIdentified} />
              <DetailItem label="Due Date" value={finding.dueDate} />
              {finding.originalDueDate && (
                <>
                  <DetailItem label="Original Due Date" value={finding.originalDueDate} />
                  <DetailItem
                    label="Extension Reason"
                    value={finding.dueDateExtensionReason || "No reason provided"}
                  />
                </>
              )}
              <div>
                <dt className="text-xs font-medium uppercase text-gray-500">Engagement</dt>
                <dd className="mt-1 text-sm text-indigo-600">
                  {engagement ? (
                    <Link href={`/engagements/${engagement.id}`} className="hover:underline">
                      {engagement.title}
                    </Link>
                  ) : (
                    finding.engagementTitle
                  )}
                </dd>
              </div>
              {workpaper && (
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-500">Workpaper</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {workpaper.reference} — {workpaper.title}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Overdue indicator */}
          {finding.status !== "CLOSED" && finding.dueDate < "2026-02-19" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-semibold text-red-700">Overdue</p>
              </div>
              <p className="mt-1 text-xs text-red-600">
                This finding was due on {finding.dueDate}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const ROLE_LABELS: Record<string, string> = {
  PREPARER: "Prepared by",
  REVIEWER: "Reviewed by",
  APPROVER: "Approved by",
};

function FindingSignoffRow({ signoff }: { signoff: Signoff }) {
  const roleLabel = ROLE_LABELS[signoff.role] ?? signoff.role;
  const date = new Date(signoff.signedAt);
  return (
    <div className="flex items-start gap-2">
      <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <div className="min-w-0">
        <p className="text-xs text-gray-700">
          <span className="font-medium">{roleLabel}:</span> {signoff.signedBy}
        </p>
        <p className="text-xs text-gray-400">
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{" "}
          {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </p>
        {signoff.comment && (
          <p className="mt-0.5 text-xs italic text-gray-500">&ldquo;{signoff.comment}&rdquo;</p>
        )}
      </div>
    </div>
  );
}

function FollowUpCard({ followUp }: { followUp: FollowUp }) {
  const statusStyle =
    followUp.status === "CLOSED"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">{followUp.date}</span>
          <span className="text-xs text-gray-400">&middot;</span>
          <span className="text-xs text-gray-700">{followUp.performedBy}</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle}`}>
          {followUp.status}
        </span>
      </div>
      <p className="text-sm text-gray-600">{followUp.notes}</p>
      {followUp.evidenceFiles.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {followUp.evidenceFiles.map((f) => (
            <span
              key={f.id}
              className="inline-flex items-center rounded bg-white px-2 py-1 text-xs text-gray-600 border border-gray-200"
            >
              <svg className="mr-1 h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {f.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

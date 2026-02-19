import Link from "next/link";
import { mockEngagements, mockFindings, mockWorkpapers, getAuditGroupLabel, SECTION_PHASES, type SectionState, type Signoff, type FieldworkWorkpaper } from "@/lib/mock-data";
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

  const findings = mockFindings.filter((f) => f.engagementId === engagement.id);
  const workpapers = mockWorkpapers.filter((w) => w.engagementId === engagement.id);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/engagements"
          className="mb-3 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Engagements
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{engagement.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {engagement.department}
              <span className="mx-2">&middot;</span>
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-700">
                {getAuditGroupLabel(engagement.auditGroup)}
              </span>
              <span className="mx-2">&middot;</span>
              Audit Year {engagement.auditYear}
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={engagement.status} />
            <RiskBadge risk={engagement.riskRating} />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Lead Auditor</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{engagement.leadAuditor}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Timeline</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{engagement.startDate} — {engagement.endDate}</p>
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
            <span className="text-lg font-semibold text-gray-900">{engagement.progress}%</span>
          </div>
        </div>
      </div>

      {/* Engagement Sections (Planning, Fieldwork, Reporting, Closing) */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Engagement Sections</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {engagement.sections.map((section) => (
            <SectionCard key={section.phase} section={section} />
          ))}
        </div>
      </div>

      {/* Fieldwork — Workpapers */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Fieldwork Workpapers ({workpapers.length})
          </h2>
        </div>
        {workpapers.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-500">No workpapers yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workpapers.map((wp) => (
              <WorkpaperCard key={wp.id} workpaper={wp} />
            ))}
          </div>
        )}
      </div>

      {/* Audit Documents */}
      <div className="mb-8">
        <EngagementDocuments engagementId={engagement.id} engagementStatus={engagement.status} />
      </div>

      {/* Findings */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Findings ({findings.length})</h2>
        </div>
        {findings.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-500">No findings recorded yet</p>
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
                  <p className="text-sm font-medium text-gray-900">{f.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {f.id}
                    {f.workpaperId && <span> &middot; Workpaper: {mockWorkpapers.find(w => w.id === f.workpaperId)?.reference ?? f.workpaperId}</span>}
                    <span> &middot; Owner: {f.owner}</span>
                    <span> &middot; Due: {f.dueDate}</span>
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

// ---------------------------------------------------------------------------
// Section card with signoff/approval workflow
// ---------------------------------------------------------------------------

const SECTION_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-gray-100", text: "text-gray-600", label: "Pending" },
  SIGNED_OFF: { bg: "bg-blue-100", text: "text-blue-700", label: "Signed Off" },
  APPROVED: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
};

const ROLE_LABELS: Record<string, string> = {
  PREPARER: "Prepared by",
  REVIEWER: "Reviewed by",
  APPROVER: "Approved by",
};

function SectionCard({ section }: { section: SectionState }) {
  const phaseLabel = SECTION_PHASES.find((p) => p.key === section.phase)?.label ?? section.phase;
  const style = SECTION_STATUS_STYLES[section.status] ?? SECTION_STATUS_STYLES.PENDING;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{phaseLabel}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
          {style.label}
        </span>
      </div>

      {section.signoffs.length === 0 ? (
        <p className="text-xs text-gray-400">No signoffs yet</p>
      ) : (
        <div className="space-y-2">
          {section.signoffs.map((so) => (
            <SignoffRow key={so.id} signoff={so} />
          ))}
        </div>
      )}
    </div>
  );
}

function SignoffRow({ signoff }: { signoff: Signoff }) {
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
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          {" "}
          {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </p>
        {signoff.comment && (
          <p className="mt-0.5 text-xs italic text-gray-500">&ldquo;{signoff.comment}&rdquo;</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Workpaper card
// ---------------------------------------------------------------------------

const WP_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  NOT_STARTED: { bg: "bg-gray-100", text: "text-gray-600" },
  IN_PROGRESS: { bg: "bg-yellow-100", text: "text-yellow-700" },
  COMPLETED: { bg: "bg-green-100", text: "text-green-700" },
  REVIEWED: { bg: "bg-blue-100", text: "text-blue-700" },
};

function WorkpaperCard({ workpaper }: { workpaper: FieldworkWorkpaper }) {
  const style = WP_STATUS_STYLES[workpaper.status] ?? WP_STATUS_STYLES.NOT_STARTED;
  const totalMinutes = workpaper.steps.reduce((sum, s) => sum + s.timeSpentMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700">
            {workpaper.reference}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{workpaper.title}</p>
            <p className="text-xs text-gray-500">
              {workpaper.preparedBy}
              {workpaper.preparedDate && <span> &middot; {workpaper.preparedDate}</span>}
              <span> &middot; {totalHours}h total</span>
              {workpaper.findings.length > 0 && (
                <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700">
                  {workpaper.findings.length} finding{workpaper.findings.length !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
          {workpaper.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Steps */}
      <div className="divide-y divide-gray-50">
        {workpaper.steps.map((step, i) => (
          <div key={step.id} className="px-6 py-4">
            <p className="mb-2 text-sm font-medium text-gray-900">
              Step {i + 1}: {step.title}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Population" value={step.population} />
              <Field label="Sample" value={step.sample} />
              <Field label="Documents Provided By" value={`${step.documentsProvidedBy}${step.documentsProvidedDate ? ` (${step.documentsProvidedDate})` : ""}`} />
              <Field label="Test Steps & Attributes" value={step.testStepsAndAttributes} full />
              {step.attachedFiles.length > 0 && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <p className="text-xs font-medium text-gray-500">Attached Files</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {step.attachedFiles.map((f) => (
                      <span key={f.id} className="inline-flex items-center rounded bg-gray-50 px-2 py-1 text-xs text-gray-700">
                        <svg className="mr-1 h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {step.results && <Field label="Results" value={step.results} full />}
              {step.conclusion && <Field label="Conclusion" value={step.conclusion} full />}
              <Field label="Time Spent" value={`${step.timeSpentMinutes} min (${(step.timeSpentMinutes / 60).toFixed(1)}h)`} />
            </div>
          </div>
        ))}
      </div>

      {/* Signoffs */}
      {workpaper.signoffs.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Workpaper Signoffs</p>
          <div className="flex flex-wrap gap-4">
            {workpaper.signoffs.map((so) => (
              <SignoffRow key={so.id} signoff={so} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2 lg:col-span-3" : ""}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-0.5 whitespace-pre-line text-xs text-gray-700">{value}</p>
    </div>
  );
}

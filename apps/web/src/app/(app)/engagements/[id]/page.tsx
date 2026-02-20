"use client";

import { useState } from "react";
import Link from "next/link";
import {
  mockEngagements,
  mockFindings,
  mockWorkpapers,
  mockSectionDocuments,
  getAuditGroupLabel,
  SECTION_PHASES,
  SECTION_FOLDERS,
  type SectionPhase,
  type SectionState,
  type Signoff,
  type FieldworkWorkpaper,
  type SectionDocument,
  type SectionFolder,
} from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";

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
  const sectionDocs = mockSectionDocuments[engagement.id] ?? [];

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

      {/* Engagement Sections with document folders */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Engagement Sections</h2>
        <div className="space-y-4">
          {engagement.sections.map((section) => (
            <SectionPanel
              key={section.phase}
              section={section}
              documents={sectionDocs}
              engagementId={engagement.id}
            />
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

// =============================================================================
// Section Panel — collapsible section with signoff + document folders
// =============================================================================

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

const SECTION_NUMBERS: Record<SectionPhase, string> = {
  PLANNING: "01",
  FIELDWORK: "02",
  REPORTING: "03",
  CLOSING: "04",
};

function SectionPanel({
  section,
  documents,
  engagementId,
}: {
  section: SectionState;
  documents: SectionDocument[];
  engagementId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const phaseLabel = SECTION_PHASES.find((p) => p.key === section.phase)?.label ?? section.phase;
  const style = SECTION_STATUS_STYLES[section.status] ?? SECTION_STATUS_STYLES.PENDING;
  const folders = SECTION_FOLDERS[section.phase] ?? [];
  const sectionNum = SECTION_NUMBERS[section.phase];

  const phaseDocs = documents.filter((d) =>
    folders.some((f) => f.code === d.folderCode)
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Section header — click to expand */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">
            {sectionNum}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{phaseLabel}</p>
            <p className="text-xs text-gray-500">
              {folders.length} folders &middot; {phaseDocs.length} document{phaseDocs.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
            {style.label}
          </span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="border-t border-gray-200">
          {/* Signoffs */}
          {section.signoffs.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Signoffs</p>
              <div className="space-y-2">
                {section.signoffs.map((so) => (
                  <SignoffRow key={so.id} signoff={so} />
                ))}
              </div>
            </div>
          )}

          {/* Document folders */}
          <div className="divide-y divide-gray-100">
            {folders.map((folder) => (
              <FolderRow
                key={folder.code}
                folder={folder}
                documents={documents.filter((d) => d.folderCode === folder.code)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Folder Row — expandable folder with documents + upload
// =============================================================================

function FolderRow({
  folder,
  documents,
}: {
  folder: SectionFolder;
  documents: SectionDocument[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  function handleUpload() {
    // PoC: simulate file upload
    setUploadMessage("File upload dialog would open here (PoC)");
    setTimeout(() => setUploadMessage(""), 3000);
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Folder icon */}
          <svg
            className={`h-5 w-5 flex-shrink-0 ${documents.length > 0 ? "text-yellow-500" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <div>
            <p className="text-sm text-gray-900">
              <span className="font-mono text-xs font-semibold text-indigo-600">{folder.code}</span>
              <span className="mx-1.5 text-gray-300">—</span>
              <span className="font-medium">{folder.label}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {documents.length > 0 && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {documents.length}
            </span>
          )}
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="bg-gray-50 px-6 pb-4 pt-1">
          {/* Upload button */}
          <div className="mb-3 flex items-center gap-3">
            <button
              onClick={handleUpload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              Upload Document
            </button>
            {uploadMessage && (
              <span className="text-xs text-indigo-600">{uploadMessage}</span>
            )}
          </div>

          {/* Documents list */}
          {documents.length === 0 ? (
            <div className="flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-xs text-gray-400">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {documents.map((doc) => {
                const date = new Date(doc.uploadedAt);
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileIcon name={doc.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {doc.uploadedBy} &middot;{" "}
                          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          &middot; {doc.size}
                        </p>
                      </div>
                    </div>
                    <button className="ml-4 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const colors: Record<string, string> = {
    pdf: "text-red-500",
    xlsx: "text-green-600",
    xls: "text-green-600",
    docx: "text-blue-600",
    doc: "text-blue-600",
    pptx: "text-orange-500",
  };
  const color = colors[ext] ?? "text-gray-400";
  return (
    <svg className={`h-5 w-5 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

// =============================================================================
// Signoff row
// =============================================================================

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

// =============================================================================
// Workpaper card
// =============================================================================

const WP_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  NOT_STARTED: { bg: "bg-gray-100", text: "text-gray-600" },
  IN_PROGRESS: { bg: "bg-yellow-100", text: "text-yellow-700" },
  COMPLETED: { bg: "bg-green-100", text: "text-green-700" },
  REVIEWED: { bg: "bg-blue-100", text: "text-blue-700" },
};

function WorkpaperCard({ workpaper }: { workpaper: FieldworkWorkpaper }) {
  const wpStyle = WP_STATUS_STYLES[workpaper.status] ?? WP_STATUS_STYLES.NOT_STARTED;
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
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${wpStyle.bg} ${wpStyle.text}`}>
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

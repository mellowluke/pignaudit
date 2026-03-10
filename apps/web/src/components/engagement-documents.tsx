"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  type AuditTrailStore,
  type AuditTrailEvent,
  type PolicyFlag,
  type PolicySeverity,
  createEvent,
  recordEventAndEvaluate,
  PHASE_ORDER,
} from "@/lib/audit-trail";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DocumentCategory = "documentation" | "testing" | "findings";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  previewUrl?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES: {
  key: DocumentCategory;
  label: string;
  description: string;
}[] = [
  {
    key: "documentation",
    label: "Documentation",
    description:
      "Audit plans, scope documents, memos, and supporting documentation",
  },
  {
    key: "testing",
    label: "Testing",
    description:
      "Work programs, test procedures, sample selections, and evidence",
  },
  {
    key: "findings",
    label: "Findings",
    description:
      "Finding write-ups, management responses, and remediation evidence",
  },
];

// ---------------------------------------------------------------------------
// Mock pre-existing data
// ---------------------------------------------------------------------------

// Placeholder SVG images for mock image files
const MOCK_IMAGE_PLACEHOLDER = (label: string, color: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="${color}"/>
      <rect x="50" y="50" width="700" height="500" rx="8" fill="rgba(255,255,255,0.15)"/>
      <circle cx="200" cy="180" r="60" fill="rgba(255,255,255,0.25)"/>
      <rect x="80" y="280" width="640" height="12" rx="6" fill="rgba(255,255,255,0.3)"/>
      <rect x="80" y="308" width="500" height="10" rx="5" fill="rgba(255,255,255,0.2)"/>
      <rect x="80" y="330" width="580" height="10" rx="5" fill="rgba(255,255,255,0.2)"/>
      <text x="400" y="490" font-family="system-ui,sans-serif" font-size="20" font-weight="600"
            fill="rgba(255,255,255,0.9)" text-anchor="middle">${label}</text>
    </svg>`
  )}`;

const MOCK_DOCUMENTS: Record<
  string,
  Record<DocumentCategory, UploadedFile[]>
> = {
  "eng-001": {
    documentation: [
      {
        id: "doc-1",
        name: "Q1 2026 Audit Plan.pdf",
        size: 245000,
        type: "application/pdf",
        uploadedAt: "2026-01-15",
        uploadedBy: "Sarah Chen",
      },
      {
        id: "doc-2",
        name: "Financial Controls Scope Memo.docx",
        size: 128000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadedAt: "2026-01-16",
        uploadedBy: "Sarah Chen",
      },
      {
        id: "doc-img-1",
        name: "AP_Process_Flowchart.png",
        size: 184000,
        type: "image/png",
        uploadedAt: "2026-01-18",
        uploadedBy: "Sarah Chen",
        previewUrl: MOCK_IMAGE_PLACEHOLDER("AP Process Flowchart", "#4f46e5"),
      },
    ],
    testing: [
      {
        id: "doc-3",
        name: "AP Process Walkthrough.xlsx",
        size: 89000,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2026-01-28",
        uploadedBy: "Sarah Chen",
      },
      {
        id: "doc-img-2",
        name: "Invoice_Exception_Screenshot.jpg",
        size: 98000,
        type: "image/jpeg",
        uploadedAt: "2026-02-03",
        uploadedBy: "Sarah Chen",
        previewUrl: MOCK_IMAGE_PLACEHOLDER("Invoice Exception Screenshot", "#0891b2"),
      },
    ],
    findings: [],
  },
  "eng-003": {
    documentation: [
      {
        id: "doc-4",
        name: "Procurement Audit Plan.pdf",
        size: 198000,
        type: "application/pdf",
        uploadedAt: "2025-11-01",
        uploadedBy: "Emily Rodriguez",
      },
    ],
    testing: [
      {
        id: "doc-5",
        name: "PO Sample Testing.xlsx",
        size: 156000,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2025-12-05",
        uploadedBy: "Emily Rodriguez",
      },
      {
        id: "doc-6",
        name: "Vendor Approval Evidence.zip",
        size: 4200000,
        type: "application/zip",
        uploadedAt: "2025-12-18",
        uploadedBy: "Emily Rodriguez",
      },
      {
        id: "doc-img-3",
        name: "Vendor_Approval_Email.png",
        size: 76000,
        type: "image/png",
        uploadedAt: "2025-12-20",
        uploadedBy: "Emily Rodriguez",
        previewUrl: MOCK_IMAGE_PLACEHOLDER("Vendor Approval Email", "#059669"),
      },
    ],
    findings: [
      {
        id: "doc-7",
        name: "FND-002 Missing Approvals Writeup.pdf",
        size: 112000,
        type: "application/pdf",
        uploadedAt: "2026-01-10",
        uploadedBy: "Emily Rodriguez",
      },
      {
        id: "doc-img-4",
        name: "Missing_Approval_Evidence.jpg",
        size: 134000,
        type: "image/jpeg",
        uploadedAt: "2026-01-12",
        uploadedBy: "Emily Rodriguez",
        previewUrl: MOCK_IMAGE_PLACEHOLDER("Missing Approval Evidence", "#dc2626"),
      },
    ],
  },
};

function buildMockTrail(
  engagementId: string,
  docs: Record<DocumentCategory, UploadedFile[]>
): AuditTrailStore {
  const events: AuditTrailEvent[] = [];
  for (const [cat, files] of Object.entries(docs)) {
    for (const file of files) {
      events.push({
        id: `evt-seed-${file.id}`,
        engagementId,
        eventType: "DOCUMENT_UPLOADED",
        category: cat.toUpperCase(),
        targetId: file.id,
        targetName: file.name,
        metadata: { fileSize: file.size, mimeType: file.type },
        actorName: file.uploadedBy,
        createdAt: new Date(file.uploadedAt).toISOString(),
      });
    }
  }
  return { events, flags: [] };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string): string {
  if (type.includes("pdf")) return "PDF";
  if (type.includes("spreadsheet") || type.includes("excel")) return "XLS";
  if (type.includes("word") || type.includes("document")) return "DOC";
  if (type.includes("image")) return "IMG";
  if (type.includes("zip") || type.includes("compressed")) return "ZIP";
  if (type.includes("presentation") || type.includes("powerpoint"))
    return "PPT";
  return "FILE";
}

function getFileIconColor(type: string): string {
  if (type.includes("pdf")) return "bg-red-100 text-red-700";
  if (type.includes("spreadsheet") || type.includes("excel"))
    return "bg-green-100 text-green-700";
  if (type.includes("word") || type.includes("document"))
    return "bg-blue-100 text-blue-700";
  if (type.includes("image")) return "bg-purple-100 text-purple-700";
  if (type.includes("zip") || type.includes("compressed"))
    return "bg-yellow-100 text-yellow-700";
  if (type.includes("presentation") || type.includes("powerpoint"))
    return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-700";
}

const SEVERITY_STYLES: Record<
  PolicySeverity,
  { bg: string; border: string; icon: string; text: string }
> = {
  INFO: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-500",
    text: "text-blue-800",
  },
  WARNING: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "text-yellow-500",
    text: "text-yellow-800",
  },
  VIOLATION: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-500",
    text: "text-red-800",
  },
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function EngagementDocuments({
  engagementId,
  engagementStatus,
}: {
  engagementId: string;
  engagementStatus: string;
}) {
  const [openSections, setOpenSections] = useState<
    Record<DocumentCategory, boolean>
  >({
    documentation: true,
    testing: false,
    findings: false,
  });

  const existingDocs = MOCK_DOCUMENTS[engagementId] || {
    documentation: [],
    testing: [],
    findings: [],
  };
  const [documents, setDocuments] =
    useState<Record<DocumentCategory, UploadedFile[]>>(existingDocs);

  // Audit trail state
  const [trail] = useState<AuditTrailStore>(() =>
    buildMockTrail(engagementId, existingDocs)
  );
  const [flags, setFlags] = useState<PolicyFlag[]>([]);
  const [recentFlags, setRecentFlags] = useState<PolicyFlag[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const getDocumentCounts = useCallback((): Record<string, number> => {
    return {
      DOCUMENTATION: documents.documentation.length,
      TESTING: documents.testing.length,
      FINDINGS: documents.findings.length,
    };
  }, [documents]);

  const toggleSection = (category: DocumentCategory) => {
    setOpenSections((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleFilesSelected = (
    category: DocumentCategory,
    files: FileList
  ) => {
    const fileArray = Array.from(files);

    // For image files, read as data URLs for preview; then update state
    const readPromises = fileArray.map(
      (file) =>
        new Promise<UploadedFile>((resolve) => {
          const base: UploadedFile = {
            id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            uploadedAt: new Date().toISOString().split("T")[0],
            uploadedBy: "Current User",
          };
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({ ...base, previewUrl: e.target?.result as string });
            };
            reader.onerror = () => resolve(base);
            reader.readAsDataURL(file);
          } else {
            resolve(base);
          }
        })
    );

    Promise.all(readPromises).then((newFiles) => {
      // Update documents first so counts are accurate
      const updatedDocs = {
        ...documents,
        [category]: [...documents[category], ...newFiles],
      };
      setDocuments(updatedDocs);

    // Record audit trail event for each file and evaluate policies
    const allNewFlags: PolicyFlag[] = [];
    for (const file of newFiles) {
      const event = createEvent(engagementId, "DOCUMENT_UPLOADED", {
        category: category.toUpperCase(),
        targetId: file.id,
        targetName: file.name,
        metadata: { fileSize: file.size, mimeType: file.type },
      });

      const context = {
        engagementStatus,
        documentCounts: {
          DOCUMENTATION: updatedDocs.documentation.length,
          TESTING: updatedDocs.testing.length,
          FINDINGS: updatedDocs.findings.length,
        },
      };

      const { newFlags } = recordEventAndEvaluate(trail, event, context);
      allNewFlags.push(...newFlags);
    }

    if (allNewFlags.length > 0) {
      setFlags((prev) => [...prev, ...allNewFlags]);
      setRecentFlags(allNewFlags);
      // Clear flash after 10 seconds
      setTimeout(() => setRecentFlags([]), 10000);
    }
    }); // end Promise.all
  };

  const handleRemoveFile = (category: DocumentCategory, fileId: string) => {
    const file = documents[category].find((f) => f.id === fileId);

    setDocuments((prev) => ({
      ...prev,
      [category]: prev[category].filter((f) => f.id !== fileId),
    }));

    // Record removal event
    if (file) {
      const event = createEvent(engagementId, "DOCUMENT_REMOVED", {
        category: category.toUpperCase(),
        targetId: file.id,
        targetName: file.name,
        metadata: { fileSize: file.size, mimeType: file.type },
      });

      const context = {
        engagementStatus,
        documentCounts: getDocumentCounts(),
      };

      const { newFlags } = recordEventAndEvaluate(trail, event, context);
      if (newFlags.length > 0) {
        setFlags((prev) => [...prev, ...newFlags]);
        setRecentFlags(newFlags);
        setTimeout(() => setRecentFlags([]), 10000);
      }
    }
  };

  const handleResolveFlag = (flagId: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, resolved: true } : f))
    );
    // Also update in trail store
    const trailFlag = trail.flags.find((f) => f.id === flagId);
    if (trailFlag) trailFlag.resolved = true;
  };

  const unresolvedFlags = flags.filter((f) => !f.resolved);
  const engagementPhaseOrder = PHASE_ORDER[engagementStatus] ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Audit Documents
        </h2>
        <div className="flex items-center gap-2">
          {unresolvedFlags.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              {unresolvedFlags.length} policy flag
              {unresolvedFlags.length !== 1 ? "s" : ""}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {trail.events.length} events tracked
          </span>
        </div>
      </div>

      {/* Flash policy flags */}
      {recentFlags.length > 0 && (
        <div className="space-y-2">
          {recentFlags.map((flag) => (
            <PolicyFlagAlert
              key={flag.id}
              flag={flag}
              onResolve={handleResolveFlag}
            />
          ))}
        </div>
      )}

      {/* Persistent unresolved flags */}
      {unresolvedFlags.length > 0 && recentFlags.length === 0 && (
        <div className="space-y-2">
          {unresolvedFlags.slice(0, 3).map((flag) => (
            <PolicyFlagAlert
              key={flag.id}
              flag={flag}
              onResolve={handleResolveFlag}
            />
          ))}
          {unresolvedFlags.length > 3 && (
            <p className="text-xs text-gray-500">
              + {unresolvedFlags.length - 3} more flag
              {unresolvedFlags.length - 3 !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      {/* Document sections */}
      {CATEGORIES.map(({ key, label, description }) => {
        const isOpen = openSections[key];
        const files = documents[key];

        // Phase gate visual hint
        let phaseWarning: string | null = null;
        if (key === "testing" && engagementPhaseOrder < 2) {
          phaseWarning = "Requires Fieldwork phase";
        } else if (key === "findings" && engagementPhaseOrder < 3) {
          phaseWarning = "Requires Review phase";
        }

        return (
          <div
            key={key}
            className="rounded-lg border border-gray-200 bg-white"
          >
            <button
              onClick={() => toggleSection(key)}
              className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {label}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {files.length}
                  </span>
                  {phaseWarning && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                      </svg>
                      {phaseWarning}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400">{description}</span>
            </button>

            {isOpen && (
              <div className="border-t border-gray-200 px-6 py-4">
                {files.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {file.type.startsWith("image/") && file.previewUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewFile(file)}
                              className="relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded cursor-zoom-in group"
                              title="View image"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={file.previewUrl}
                                alt={file.name}
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute inset-0 flex items-center justify-center rounded bg-black/0 group-hover:bg-black/30 transition-colors">
                                <svg
                                  className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2.5}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35zM10.5 13.5V10.5m0 0V7.5m0 3H7.5m3 0h3" />
                                </svg>
                              </span>
                            </button>
                          ) : (
                            <span
                              className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded text-xs font-bold ${getFileIconColor(file.type)}`}
                            >
                              {getFileIcon(file.type)}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} &middot;{" "}
                              {file.uploadedBy} &middot; {file.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4 flex flex-shrink-0 items-center gap-1">
                          {file.type.startsWith("image/") && file.previewUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewFile(file)}
                              className="rounded p-1 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                              title="View image"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveFile(key, file.id)}
                            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Remove file"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <DropZone
                  category={key}
                  onFilesSelected={handleFilesSelected}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Image lightbox */}
      {previewFile && (
        <ImageLightbox
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Audit trail timeline (exported for use in engagement detail page)
// ---------------------------------------------------------------------------

export function AuditTrailTimeline({
  engagementId,
  engagementStatus,
}: {
  engagementId: string;
  engagementStatus: string;
}) {
  // Build seed trail from mock documents
  const existingDocs = MOCK_DOCUMENTS[engagementId] || {
    documentation: [],
    testing: [],
    findings: [],
  };
  const trail = buildMockTrail(engagementId, existingDocs);

  if (trail.events.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center">
        <p className="text-sm text-gray-500">No events recorded yet</p>
      </div>
    );
  }

  const sorted = [...trail.events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-3">
      {sorted.map((event) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <EventDot eventType={event.eventType} />
            <div className="w-px flex-1 bg-gray-200" />
          </div>
          <div className="pb-3 min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{event.actorName}</span>{" "}
              {formatEventAction(event)}
            </p>
            {event.targetName && (
              <p className="truncate text-xs font-medium text-gray-700">
                {event.targetName}
              </p>
            )}
            <p className="text-xs text-gray-400">
              {event.category && (
                <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                  {event.category}
                </span>
              )}
              {new Date(event.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventDot({ eventType }: { eventType: string }) {
  let color = "bg-gray-400";
  if (eventType === "DOCUMENT_UPLOADED") color = "bg-green-500";
  if (eventType === "DOCUMENT_REMOVED") color = "bg-red-500";
  if (eventType === "DOCUMENT_REPLACED") color = "bg-blue-500";
  if (eventType === "STATUS_CHANGED") color = "bg-indigo-500";

  return <div className={`mt-1.5 h-2 w-2 rounded-full ${color}`} />;
}

function formatEventAction(event: AuditTrailEvent): string {
  switch (event.eventType) {
    case "DOCUMENT_UPLOADED":
      return "uploaded a document";
    case "DOCUMENT_REMOVED":
      return "removed a document";
    case "DOCUMENT_REPLACED":
      return "replaced a document";
    case "STATUS_CHANGED": {
      const meta = event.metadata as Record<string, unknown> | null;
      if (meta?.previousStatus && meta?.newStatus) {
        return `changed status from ${meta.previousStatus} to ${meta.newStatus}`;
      }
      return "changed engagement status";
    }
    default:
      return event.eventType.toLowerCase().replace(/_/g, " ");
  }
}

// ---------------------------------------------------------------------------
// Policy flags display component (exported)
// ---------------------------------------------------------------------------

export function PolicyFlagsPanel({
  engagementId,
}: {
  engagementId: string;
}) {
  // In the mock version, flags are generated when users interact with documents.
  // This component shows the policy rules that are active.
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Active policy rules evaluated on every document change:
      </p>
      {[
        {
          code: "TESTING_REQUIRES_FIELDWORK",
          name: "Testing requires Fieldwork",
          severity: "VIOLATION" as PolicySeverity,
          desc: "Testing docs blocked until Fieldwork phase",
        },
        {
          code: "FINDINGS_REQUIRE_REVIEW",
          name: "Findings require Review",
          severity: "WARNING" as PolicySeverity,
          desc: "Finding docs flagged if uploaded before Review",
        },
        {
          code: "DOCUMENTATION_RETROACTIVE_CHANGE",
          name: "Retroactive documentation change",
          severity: "WARNING" as PolicySeverity,
          desc: "Flags when docs change after dependent work exists",
        },
        {
          code: "TESTING_RETROACTIVE_CHANGE",
          name: "Retroactive testing change",
          severity: "WARNING" as PolicySeverity,
          desc: "Flags when testing changes after findings exist",
        },
        {
          code: "DOCUMENT_REMOVED_AFTER_REVIEW",
          name: "Document removed after Review",
          severity: "VIOLATION" as PolicySeverity,
          desc: "Blocks unjustified removal during late phases",
        },
        {
          code: "PLANNING_DOCS_BEFORE_FIELDWORK",
          name: "Planning docs required",
          severity: "WARNING" as PolicySeverity,
          desc: "At least 1 doc needed before entering Fieldwork",
        },
      ].map((rule) => {
        const s = SEVERITY_STYLES[rule.severity];
        return (
          <div
            key={rule.code}
            className={`rounded-md border px-3 py-2 ${s.border} ${s.bg}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex rounded px-1.5 py-0.5 text-xs font-bold ${s.text}`}
              >
                {rule.severity}
              </span>
              <span className={`text-sm font-medium ${s.text}`}>
                {rule.name}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-600">{rule.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PolicyFlagAlert({
  flag,
  onResolve,
}: {
  flag: PolicyFlag;
  onResolve: (id: string) => void;
}) {
  const s = SEVERITY_STYLES[flag.severity];
  return (
    <div className={`rounded-lg border px-4 py-3 ${s.border} ${s.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <svg
            className={`mt-0.5 h-5 w-5 flex-shrink-0 ${s.icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div className="min-w-0">
            <p className={`text-sm font-medium ${s.text}`}>
              {flag.policyRuleName}
            </p>
            <p className="mt-0.5 text-xs text-gray-600">{flag.message}</p>
          </div>
        </div>
        {!flag.resolved && (
          <button
            onClick={() => onResolve(flag.id)}
            className="flex-shrink-0 rounded px-2 py-1 text-xs font-medium text-gray-500 hover:bg-white hover:text-gray-700"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image Lightbox — cross-browser compatible (Chrome, Edge, Safari)
// Uses a plain React overlay instead of <dialog> to avoid browser inconsistencies
// ---------------------------------------------------------------------------

function ImageLightbox({
  file,
  onClose,
}: {
  file: UploadedFile;
  onClose: () => void;
}) {
  // Close on Escape key — works in all modern browsers
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    // Prevent body scroll while lightbox is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    // Overlay: fixed + high z-index, works in Chrome/Edge/Safari
    // Using onClick on the backdrop to close, stopPropagation on inner container
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${file.name}`}
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      className="flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop — semi-opaque black, no backdrop-filter to avoid Edge issues */}
      <div
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.85)" }}
      />

      {/* Content panel */}
      <div
        style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}
        className="flex flex-col rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-gray-900 px-4 py-2 gap-4">
          <p className="truncate text-sm font-medium text-gray-100">{file.name}</p>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image — object-contain keeps aspect ratio in all browsers */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file.previewUrl}
          alt={file.name}
          style={{ maxWidth: "90vw", maxHeight: "calc(90vh - 48px)", display: "block" }}
          className="object-contain bg-gray-800"
        />
      </div>
    </div>
  );
}

function DropZone({
  category,
  onFilesSelected,
}: {
  category: DocumentCategory;
  onFilesSelected: (category: DocumentCategory, files: FileList) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      onFilesSelected(category, e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(category, e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors ${
        isDragging
          ? "border-indigo-400 bg-indigo-50"
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      <svg
        className={`mb-2 h-8 w-8 ${isDragging ? "text-indigo-500" : "text-gray-400"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
        />
      </svg>
      <p className="text-sm text-gray-600">
        <span className="font-medium text-indigo-600">Click to upload</span> or
        drag and drop
      </p>
      <p className="mt-1 text-xs text-gray-500">All file types accepted</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}

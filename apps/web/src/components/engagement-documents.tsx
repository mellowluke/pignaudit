"use client";

import { useState, useRef } from "react";

type DocumentCategory = "documentation" | "testing" | "findings";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}

const CATEGORIES: { key: DocumentCategory; label: string; description: string }[] = [
  {
    key: "documentation",
    label: "Documentation",
    description: "Audit plans, scope documents, memos, and supporting documentation",
  },
  {
    key: "testing",
    label: "Testing",
    description: "Work programs, test procedures, sample selections, and evidence",
  },
  {
    key: "findings",
    label: "Findings",
    description: "Finding write-ups, management responses, and remediation evidence",
  },
];

// Mock pre-existing documents per engagement
const MOCK_DOCUMENTS: Record<string, Record<DocumentCategory, UploadedFile[]>> = {
  "eng-001": {
    documentation: [
      { id: "doc-1", name: "Q1 2026 Audit Plan.pdf", size: 245000, type: "application/pdf", uploadedAt: "2026-01-15", uploadedBy: "Sarah Chen" },
      { id: "doc-2", name: "Financial Controls Scope Memo.docx", size: 128000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", uploadedAt: "2026-01-16", uploadedBy: "Sarah Chen" },
    ],
    testing: [
      { id: "doc-3", name: "AP Process Walkthrough.xlsx", size: 89000, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", uploadedAt: "2026-01-28", uploadedBy: "Sarah Chen" },
    ],
    findings: [],
  },
  "eng-003": {
    documentation: [
      { id: "doc-4", name: "Procurement Audit Plan.pdf", size: 198000, type: "application/pdf", uploadedAt: "2025-11-01", uploadedBy: "Emily Rodriguez" },
    ],
    testing: [
      { id: "doc-5", name: "PO Sample Testing.xlsx", size: 156000, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", uploadedAt: "2025-12-05", uploadedBy: "Emily Rodriguez" },
      { id: "doc-6", name: "Vendor Approval Evidence.zip", size: 4200000, type: "application/zip", uploadedAt: "2025-12-18", uploadedBy: "Emily Rodriguez" },
    ],
    findings: [
      { id: "doc-7", name: "FND-002 Missing Approvals Writeup.pdf", size: 112000, type: "application/pdf", uploadedAt: "2026-01-10", uploadedBy: "Emily Rodriguez" },
    ],
  },
};

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
  if (type.includes("presentation") || type.includes("powerpoint")) return "PPT";
  return "FILE";
}

function getFileIconColor(type: string): string {
  if (type.includes("pdf")) return "bg-red-100 text-red-700";
  if (type.includes("spreadsheet") || type.includes("excel")) return "bg-green-100 text-green-700";
  if (type.includes("word") || type.includes("document")) return "bg-blue-100 text-blue-700";
  if (type.includes("image")) return "bg-purple-100 text-purple-700";
  if (type.includes("zip") || type.includes("compressed")) return "bg-yellow-100 text-yellow-700";
  if (type.includes("presentation") || type.includes("powerpoint")) return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-700";
}

export default function EngagementDocuments({ engagementId }: { engagementId: string }) {
  const [openSections, setOpenSections] = useState<Record<DocumentCategory, boolean>>({
    documentation: true,
    testing: false,
    findings: false,
  });

  const existingDocs = MOCK_DOCUMENTS[engagementId] || { documentation: [], testing: [], findings: [] };
  const [documents, setDocuments] = useState<Record<DocumentCategory, UploadedFile[]>>(existingDocs);

  const toggleSection = (category: DocumentCategory) => {
    setOpenSections((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleFilesSelected = (category: DocumentCategory, files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      uploadedAt: new Date().toISOString().split("T")[0],
      uploadedBy: "Current User",
    }));

    setDocuments((prev) => ({
      ...prev,
      [category]: [...prev[category], ...newFiles],
    }));
  };

  const handleRemoveFile = (category: DocumentCategory, fileId: string) => {
    setDocuments((prev) => ({
      ...prev,
      [category]: prev[category].filter((f) => f.id !== fileId),
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Audit Documents</h2>
      {CATEGORIES.map(({ key, label, description }) => {
        const isOpen = openSections[key];
        const files = documents[key];
        return (
          <div key={key} className="rounded-lg border border-gray-200 bg-white">
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-sm font-semibold text-gray-900">{label}</span>
                  <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {files.length}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-400">{description}</span>
            </button>

            {isOpen && (
              <div className="border-t border-gray-200 px-6 py-4">
                {/* File list */}
                {files.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`inline-flex h-9 w-9 items-center justify-center rounded text-xs font-bold ${getFileIconColor(file.type)}`}>
                            {getFileIcon(file.type)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} &middot; {file.uploadedBy} &middot; {file.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(key, file.id)}
                          className="ml-4 flex-shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Remove file"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload area */}
                <DropZone category={key} onFilesSelected={handleFilesSelected} />
              </div>
            )}
          </div>
        );
      })}
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
      </svg>
      <p className="text-sm text-gray-600">
        <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
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

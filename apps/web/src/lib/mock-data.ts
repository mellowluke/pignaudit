// =============================================================================
// Types
// =============================================================================

export type AuditGroup = "CORPORATE_RBA" | "IS_RBA" | "MAR" | "SOC";
export type EngagementStatus = "PLANNING" | "FIELDWORK" | "REVIEW" | "REPORTING" | "COMPLETED" | "CANCELLED";
export type SectionPhase = "PLANNING" | "FIELDWORK" | "REPORTING" | "CLOSING";
export type SignoffStatus = "PENDING" | "SIGNED_OFF" | "APPROVED";
export type WorkpaperStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "REVIEWED";
export type FindingWorkflowStatus = "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "CLOSED";

export const AUDIT_GROUPS: { key: AuditGroup; label: string }[] = [
  { key: "CORPORATE_RBA", label: "Corporate RBA" },
  { key: "IS_RBA", label: "IS RBA" },
  { key: "MAR", label: "MAR" },
  { key: "SOC", label: "SOC" },
];

export const SECTION_PHASES: { key: SectionPhase; label: string }[] = [
  { key: "PLANNING", label: "Planning" },
  { key: "FIELDWORK", label: "Fieldwork" },
  { key: "REPORTING", label: "Reporting" },
  { key: "CLOSING", label: "Closing" },
];

// =============================================================================
// Section Document Folders (from SharePoint structure)
// =============================================================================

export interface SectionFolder {
  code: string;
  label: string;
}

export interface SectionDocument {
  id: string;
  folderCode: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

export const SECTION_FOLDERS: Record<SectionPhase, SectionFolder[]> = {
  PLANNING: [
    { code: "P.000", label: "Pre-Audit Survey" },
    { code: "P.100", label: "Budgeted Resource Allocation" },
    { code: "P.101", label: "Communication Strategy and Status" },
    { code: "P.102", label: "Audit Announcement" },
    { code: "P.103", label: "Kick-off Meeting" },
    { code: "P.200", label: "Planning Discussions - MAR, IS, Brainstorming" },
    { code: "P.300", label: "Documentation of Understanding" },
    { code: "P.400", label: "Walkthroughs" },
    { code: "P.500", label: "Application Profile" },
    { code: "P.600", label: "Risk and Control Matrix" },
    { code: "P.700", label: "Fraud Questionnaire" },
    { code: "P.800", label: "Audit Program" },
  ],
  FIELDWORK: [
    { code: "T.000", label: "PBC Request List" },
    { code: "T.100", label: "Communication of Progress and Status" },
    { code: "T.200", label: "PAFs" },
    { code: "T.300", label: "Testing Matrix" },
    { code: "T.400", label: "Issue Log and PAF Mapping" },
    { code: "T.500", label: "Operational Testing" },
  ],
  REPORTING: [
    { code: "R.000", label: "Evaluation of Management Responses" },
    { code: "R.100", label: "Draft Audit Report" },
    { code: "R.200", label: "Management Approvals of Audit Report" },
    { code: "R.300", label: "Closing Meeting" },
    { code: "R.400", label: "Report Issuance Email Draft" },
    { code: "R.500", label: "Final Report and Issuance" },
  ],
  CLOSING: [
    { code: "C.100", label: "Budget to Actual" },
    { code: "C.200", label: "Auditee Engagement Survey" },
    { code: "C.300", label: "PAF Closing Support" },
  ],
};

// Mock documents uploaded to section folders (keyed by engagementId)
export const mockSectionDocuments: Record<string, SectionDocument[]> = {
  "eng-001": [
    { id: "sd-001", folderCode: "P.000", name: "Pre_Audit_Survey_Q1_2026.pdf", uploadedBy: "Sarah Chen", uploadedAt: "2026-01-15T09:00:00Z", size: "245 KB" },
    { id: "sd-002", folderCode: "P.100", name: "Resource_Allocation_Budget.xlsx", uploadedBy: "Sarah Chen", uploadedAt: "2026-01-15T09:30:00Z", size: "128 KB" },
    { id: "sd-003", folderCode: "P.102", name: "Audit_Announcement_Finance.pdf", uploadedBy: "Sarah Chen", uploadedAt: "2026-01-16T08:00:00Z", size: "89 KB" },
    { id: "sd-004", folderCode: "P.103", name: "Kickoff_Meeting_Minutes.docx", uploadedBy: "Marcus Johnson", uploadedAt: "2026-01-17T15:00:00Z", size: "156 KB" },
    { id: "sd-005", folderCode: "P.300", name: "Process_Understanding_AP.docx", uploadedBy: "Sarah Chen", uploadedAt: "2026-01-18T10:00:00Z", size: "312 KB" },
    { id: "sd-006", folderCode: "P.400", name: "AP_Walkthrough_Notes.docx", uploadedBy: "Sarah Chen", uploadedAt: "2026-01-19T14:00:00Z", size: "178 KB" },
    { id: "sd-007", folderCode: "P.600", name: "Risk_Control_Matrix_v2.xlsx", uploadedBy: "Sarah Chen", uploadedAt: "2026-01-20T11:00:00Z", size: "456 KB" },
    { id: "sd-008", folderCode: "P.800", name: "Audit_Program_Financial_Controls.docx", uploadedBy: "David Kim", uploadedAt: "2026-01-18T09:00:00Z", size: "234 KB" },
    { id: "sd-009", folderCode: "T.000", name: "PBC_Request_List_v1.xlsx", uploadedBy: "Sarah Chen", uploadedAt: "2026-01-22T08:30:00Z", size: "98 KB" },
    { id: "sd-010", folderCode: "T.300", name: "Testing_Matrix_AP_Controls.xlsx", uploadedBy: "Sarah Chen", uploadedAt: "2026-01-25T10:00:00Z", size: "345 KB" },
    { id: "sd-011", folderCode: "T.500", name: "Invoice_Testing_Workbook.xlsx", uploadedBy: "Sarah Chen", uploadedAt: "2026-02-01T16:00:00Z", size: "567 KB" },
    { id: "sd-012", folderCode: "T.500", name: "Access_Review_Testing.xlsx", uploadedBy: "Sarah Chen", uploadedAt: "2026-02-05T14:00:00Z", size: "234 KB" },
    { id: "sd-013", folderCode: "T.200", name: "PAF_001_SOD_Violation.docx", uploadedBy: "Sarah Chen", uploadedAt: "2026-02-03T10:00:00Z", size: "145 KB" },
    { id: "sd-014", folderCode: "T.400", name: "Issue_Log_Financial_Controls.xlsx", uploadedBy: "Sarah Chen", uploadedAt: "2026-02-08T11:00:00Z", size: "189 KB" },
  ],
  "eng-003": [
    { id: "sd-020", folderCode: "P.000", name: "Pre_Audit_Survey_Procurement.pdf", uploadedBy: "Emily Rodriguez", uploadedAt: "2025-11-01T09:00:00Z", size: "198 KB" },
    { id: "sd-021", folderCode: "P.600", name: "RCM_Procurement.xlsx", uploadedBy: "Emily Rodriguez", uploadedAt: "2025-11-05T10:00:00Z", size: "389 KB" },
    { id: "sd-022", folderCode: "P.800", name: "Audit_Program_Procurement.docx", uploadedBy: "Emily Rodriguez", uploadedAt: "2025-11-06T11:00:00Z", size: "267 KB" },
    { id: "sd-023", folderCode: "T.000", name: "PBC_List_Procurement.xlsx", uploadedBy: "Emily Rodriguez", uploadedAt: "2025-11-15T08:00:00Z", size: "112 KB" },
    { id: "sd-024", folderCode: "T.300", name: "Testing_Matrix_PO_Approvals.xlsx", uploadedBy: "Emily Rodriguez", uploadedAt: "2025-12-01T10:00:00Z", size: "445 KB" },
    { id: "sd-025", folderCode: "R.100", name: "Draft_Report_Procurement.docx", uploadedBy: "Emily Rodriguez", uploadedAt: "2026-01-15T14:00:00Z", size: "534 KB" },
  ],
  "eng-004": [
    { id: "sd-030", folderCode: "P.000", name: "Pre_Audit_Survey_Payroll.pdf", uploadedBy: "David Kim", uploadedAt: "2025-09-01T09:00:00Z", size: "176 KB" },
    { id: "sd-031", folderCode: "P.800", name: "Audit_Program_Payroll.docx", uploadedBy: "David Kim", uploadedAt: "2025-09-05T10:00:00Z", size: "245 KB" },
    { id: "sd-032", folderCode: "T.300", name: "Testing_Matrix_Payroll.xlsx", uploadedBy: "David Kim", uploadedAt: "2025-10-01T10:00:00Z", size: "312 KB" },
    { id: "sd-033", folderCode: "R.500", name: "Final_Report_Payroll.pdf", uploadedBy: "David Kim", uploadedAt: "2025-11-25T14:00:00Z", size: "678 KB" },
    { id: "sd-034", folderCode: "C.100", name: "Budget_vs_Actual_Payroll.xlsx", uploadedBy: "David Kim", uploadedAt: "2025-12-10T15:00:00Z", size: "89 KB" },
    { id: "sd-035", folderCode: "C.200", name: "Engagement_Survey_Results.pdf", uploadedBy: "David Kim", uploadedAt: "2025-12-12T10:00:00Z", size: "134 KB" },
  ],
};

// =============================================================================
// Signoff / Approval
// =============================================================================

export interface Signoff {
  id: string;
  signedBy: string;
  signedAt: string; // ISO datetime
  role: "PREPARER" | "REVIEWER" | "APPROVER";
  comment: string | null;
}

export interface SectionState {
  phase: SectionPhase;
  status: SignoffStatus;
  signoffs: Signoff[];
}

// =============================================================================
// Fieldwork Workpaper
// =============================================================================

export interface WorkpaperStep {
  id: string;
  title: string;
  population: string;
  sample: string;
  documentsProvidedBy: string;
  documentsProvidedDate: string | null;
  testStepsAndAttributes: string;
  attachedFiles: { id: string; name: string; type: string }[];
  referencedWorkpapers: string[]; // IDs of other workpapers
  results: string;
  conclusion: string;
  timeSpentMinutes: number;
}

export interface FieldworkWorkpaper {
  id: string;
  engagementId: string;
  title: string;
  reference: string; // e.g., "WP-001"
  status: WorkpaperStatus;
  preparedBy: string;
  preparedDate: string | null;
  steps: WorkpaperStep[];
  signoffs: Signoff[];
  findings: string[]; // finding IDs linked from this workpaper
}

// =============================================================================
// Enhanced Finding (with workflow)
// =============================================================================

export interface FindingData {
  id: string;
  title: string;
  engagementId: string;
  engagementTitle: string;
  workpaperId: string | null;
  status: "OPEN" | "IN_REMEDIATION" | "AWAITING_VALIDATION" | "CLOSED" | "RISK_ACCEPTED";
  workflowStatus: FindingWorkflowStatus;
  riskRating: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  owner: string;
  dueDate: string;
  originalDueDate: string | null;
  dueDateExtensionReason: string | null;
  dateIdentified: string;
  description: string;
  recommendation: string;
  managementResponse: string | null;
  signoffs: Signoff[];
  followUps: FollowUp[];
}

export interface FollowUp {
  id: string;
  date: string;
  performedBy: string;
  notes: string;
  status: "OPEN" | "CLOSED";
  evidenceFiles: { id: string; name: string }[];
}

// =============================================================================
// Engagement (enhanced)
// =============================================================================

export interface Engagement {
  id: string;
  title: string;
  department: string;
  auditYear: number;
  auditGroup: AuditGroup;
  status: EngagementStatus;
  riskRating: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  leadAuditor: string;
  startDate: string;
  endDate: string;
  findingsCount: number;
  progress: number;
  sections: SectionState[];
}

// =============================================================================
// Mock Engagements
// =============================================================================

export const mockEngagements: Engagement[] = [
  // --- 2026 ---
  {
    id: "eng-001",
    title: "Q1 2026 Financial Controls Audit",
    department: "Finance",
    auditYear: 2026,
    auditGroup: "CORPORATE_RBA",
    status: "FIELDWORK" as const,
    riskRating: "HIGH" as const,
    leadAuditor: "Sarah Chen",
    startDate: "2026-01-15",
    endDate: "2026-03-15",
    findingsCount: 4,
    progress: 65,
    sections: [
      { phase: "PLANNING", status: "APPROVED", signoffs: [
        { id: "so-001", signedBy: "Sarah Chen", signedAt: "2026-01-16T10:30:00Z", role: "PREPARER", comment: null },
        { id: "so-002", signedBy: "Marcus Johnson", signedAt: "2026-01-17T14:00:00Z", role: "REVIEWER", comment: "Scope looks good" },
        { id: "so-003", signedBy: "David Kim", signedAt: "2026-01-18T09:15:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "FIELDWORK", status: "SIGNED_OFF", signoffs: [
        { id: "so-004", signedBy: "Sarah Chen", signedAt: "2026-02-10T16:00:00Z", role: "PREPARER", comment: "Testing complete" },
      ]},
      { phase: "REPORTING", status: "PENDING", signoffs: [] },
      { phase: "CLOSING", status: "PENDING", signoffs: [] },
    ],
  },
  {
    id: "eng-002",
    title: "IT Security Compliance Review",
    department: "Information Technology",
    auditYear: 2026,
    auditGroup: "IS_RBA",
    status: "PLANNING" as const,
    riskRating: "CRITICAL" as const,
    leadAuditor: "Marcus Johnson",
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    findingsCount: 0,
    progress: 15,
    sections: [
      { phase: "PLANNING", status: "SIGNED_OFF", signoffs: [
        { id: "so-010", signedBy: "Marcus Johnson", signedAt: "2026-02-05T11:00:00Z", role: "PREPARER", comment: null },
      ]},
      { phase: "FIELDWORK", status: "PENDING", signoffs: [] },
      { phase: "REPORTING", status: "PENDING", signoffs: [] },
      { phase: "CLOSING", status: "PENDING", signoffs: [] },
    ],
  },
  {
    id: "eng-006",
    title: "SOC 2 Type II Readiness Assessment",
    department: "Information Technology",
    auditYear: 2026,
    auditGroup: "SOC",
    status: "PLANNING" as const,
    riskRating: "HIGH" as const,
    leadAuditor: "Marcus Johnson",
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    findingsCount: 0,
    progress: 5,
    sections: [
      { phase: "PLANNING", status: "PENDING", signoffs: [] },
      { phase: "FIELDWORK", status: "PENDING", signoffs: [] },
      { phase: "REPORTING", status: "PENDING", signoffs: [] },
      { phase: "CLOSING", status: "PENDING", signoffs: [] },
    ],
  },
  {
    id: "eng-007",
    title: "Anti-Money Laundering Compliance Review",
    department: "Compliance",
    auditYear: 2026,
    auditGroup: "MAR",
    status: "PLANNING" as const,
    riskRating: "CRITICAL" as const,
    leadAuditor: "Emily Rodriguez",
    startDate: "2026-04-01",
    endDate: "2026-07-31",
    findingsCount: 0,
    progress: 0,
    sections: [
      { phase: "PLANNING", status: "PENDING", signoffs: [] },
      { phase: "FIELDWORK", status: "PENDING", signoffs: [] },
      { phase: "REPORTING", status: "PENDING", signoffs: [] },
      { phase: "CLOSING", status: "PENDING", signoffs: [] },
    ],
  },
  // --- 2025 ---
  {
    id: "eng-003",
    title: "Procurement Process Audit",
    department: "Operations",
    auditYear: 2025,
    auditGroup: "CORPORATE_RBA",
    status: "REVIEW" as const,
    riskRating: "MEDIUM" as const,
    leadAuditor: "Emily Rodriguez",
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    findingsCount: 7,
    progress: 85,
    sections: [
      { phase: "PLANNING", status: "APPROVED", signoffs: [
        { id: "so-020", signedBy: "Emily Rodriguez", signedAt: "2025-11-03T09:00:00Z", role: "PREPARER", comment: null },
        { id: "so-021", signedBy: "Sarah Chen", signedAt: "2025-11-04T14:30:00Z", role: "REVIEWER", comment: null },
        { id: "so-022", signedBy: "David Kim", signedAt: "2025-11-05T10:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "FIELDWORK", status: "APPROVED", signoffs: [
        { id: "so-023", signedBy: "Emily Rodriguez", signedAt: "2025-12-20T16:00:00Z", role: "PREPARER", comment: null },
        { id: "so-024", signedBy: "Sarah Chen", signedAt: "2025-12-22T11:30:00Z", role: "REVIEWER", comment: null },
        { id: "so-025", signedBy: "David Kim", signedAt: "2025-12-23T09:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "REPORTING", status: "SIGNED_OFF", signoffs: [
        { id: "so-026", signedBy: "Emily Rodriguez", signedAt: "2026-01-15T14:00:00Z", role: "PREPARER", comment: "Draft report complete" },
      ]},
      { phase: "CLOSING", status: "PENDING", signoffs: [] },
    ],
  },
  {
    id: "eng-004",
    title: "HR Payroll Compliance Audit",
    department: "Human Resources",
    auditYear: 2025,
    auditGroup: "CORPORATE_RBA",
    status: "COMPLETED" as const,
    riskRating: "LOW" as const,
    leadAuditor: "David Kim",
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    findingsCount: 2,
    progress: 100,
    sections: [
      { phase: "PLANNING", status: "APPROVED", signoffs: [
        { id: "so-030", signedBy: "David Kim", signedAt: "2025-09-03T10:00:00Z", role: "PREPARER", comment: null },
        { id: "so-031", signedBy: "Sarah Chen", signedAt: "2025-09-04T11:00:00Z", role: "REVIEWER", comment: null },
        { id: "so-032", signedBy: "Emily Rodriguez", signedAt: "2025-09-05T09:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "FIELDWORK", status: "APPROVED", signoffs: [
        { id: "so-033", signedBy: "David Kim", signedAt: "2025-10-30T16:00:00Z", role: "PREPARER", comment: null },
        { id: "so-034", signedBy: "Sarah Chen", signedAt: "2025-11-01T10:00:00Z", role: "REVIEWER", comment: null },
        { id: "so-035", signedBy: "Emily Rodriguez", signedAt: "2025-11-02T09:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "REPORTING", status: "APPROVED", signoffs: [
        { id: "so-036", signedBy: "David Kim", signedAt: "2025-11-25T14:00:00Z", role: "PREPARER", comment: null },
        { id: "so-037", signedBy: "Sarah Chen", signedAt: "2025-11-26T10:00:00Z", role: "REVIEWER", comment: null },
        { id: "so-038", signedBy: "Emily Rodriguez", signedAt: "2025-11-27T09:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "CLOSING", status: "APPROVED", signoffs: [
        { id: "so-039", signedBy: "David Kim", signedAt: "2025-12-10T15:00:00Z", role: "PREPARER", comment: null },
        { id: "so-040", signedBy: "Sarah Chen", signedAt: "2025-12-12T10:00:00Z", role: "APPROVER", comment: "Engagement closed" },
      ]},
    ],
  },
  {
    id: "eng-005",
    title: "Vendor Risk Assessment",
    department: "Supply Chain",
    auditYear: 2025,
    auditGroup: "CORPORATE_RBA",
    status: "REPORTING" as const,
    riskRating: "HIGH" as const,
    leadAuditor: "Sarah Chen",
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    findingsCount: 5,
    progress: 90,
    sections: [
      { phase: "PLANNING", status: "APPROVED", signoffs: [
        { id: "so-050", signedBy: "Sarah Chen", signedAt: "2025-12-03T10:00:00Z", role: "PREPARER", comment: null },
        { id: "so-051", signedBy: "Emily Rodriguez", signedAt: "2025-12-04T14:00:00Z", role: "REVIEWER", comment: null },
        { id: "so-052", signedBy: "David Kim", signedAt: "2025-12-05T09:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "FIELDWORK", status: "APPROVED", signoffs: [
        { id: "so-053", signedBy: "Sarah Chen", signedAt: "2026-01-20T16:00:00Z", role: "PREPARER", comment: null },
        { id: "so-054", signedBy: "Emily Rodriguez", signedAt: "2026-01-22T11:00:00Z", role: "REVIEWER", comment: null },
        { id: "so-055", signedBy: "David Kim", signedAt: "2026-01-23T09:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "REPORTING", status: "SIGNED_OFF", signoffs: [
        { id: "so-056", signedBy: "Sarah Chen", signedAt: "2026-02-10T14:00:00Z", role: "PREPARER", comment: "Report drafted" },
      ]},
      { phase: "CLOSING", status: "PENDING", signoffs: [] },
    ],
  },
  {
    id: "eng-008",
    title: "BSA/AML Transaction Monitoring Review",
    department: "Compliance",
    auditYear: 2025,
    auditGroup: "MAR",
    status: "COMPLETED" as const,
    riskRating: "HIGH" as const,
    leadAuditor: "Emily Rodriguez",
    startDate: "2025-06-01",
    endDate: "2025-09-30",
    findingsCount: 3,
    progress: 100,
    sections: [
      { phase: "PLANNING", status: "APPROVED", signoffs: [
        { id: "so-060", signedBy: "Emily Rodriguez", signedAt: "2025-06-03T10:00:00Z", role: "PREPARER", comment: null },
        { id: "so-061", signedBy: "David Kim", signedAt: "2025-06-05T09:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "FIELDWORK", status: "APPROVED", signoffs: [
        { id: "so-062", signedBy: "Emily Rodriguez", signedAt: "2025-08-15T16:00:00Z", role: "PREPARER", comment: null },
        { id: "so-063", signedBy: "David Kim", signedAt: "2025-08-18T09:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "REPORTING", status: "APPROVED", signoffs: [
        { id: "so-064", signedBy: "Emily Rodriguez", signedAt: "2025-09-15T14:00:00Z", role: "PREPARER", comment: null },
        { id: "so-065", signedBy: "David Kim", signedAt: "2025-09-18T09:00:00Z", role: "APPROVER", comment: null },
      ]},
      { phase: "CLOSING", status: "APPROVED", signoffs: [
        { id: "so-066", signedBy: "Emily Rodriguez", signedAt: "2025-09-28T15:00:00Z", role: "PREPARER", comment: null },
        { id: "so-067", signedBy: "David Kim", signedAt: "2025-09-30T09:00:00Z", role: "APPROVER", comment: null },
      ]},
    ],
  },
];

// =============================================================================
// Mock Fieldwork Workpapers
// =============================================================================

export const mockWorkpapers: FieldworkWorkpaper[] = [
  {
    id: "wp-001",
    engagementId: "eng-001",
    title: "Accounts Payable Invoice Processing",
    reference: "WP-001",
    status: "COMPLETED",
    preparedBy: "Sarah Chen",
    preparedDate: "2026-02-01",
    steps: [
      {
        id: "step-001",
        title: "Invoice approval workflow testing",
        population: "All AP invoices processed in Q4 2025 (1,247 invoices, total value $4.2M)",
        sample: "25 invoices selected using systematic random sampling (every 50th invoice)",
        documentsProvidedBy: "Lisa Wang, AP Manager",
        documentsProvidedDate: "2026-01-25",
        testStepsAndAttributes: "1. Verify invoice has proper approval signature\n2. Confirm three-way match (PO, receipt, invoice)\n3. Check approval authority vs. invoice amount\n4. Verify coding to correct GL account\n5. Confirm timely processing (within 30 days)",
        attachedFiles: [
          { id: "file-001", name: "AP_Invoice_Sample_Selection.xlsx", type: "spreadsheet" },
          { id: "file-002", name: "Invoice_Testing_Matrix.xlsx", type: "spreadsheet" },
        ],
        referencedWorkpapers: [],
        results: "23 of 25 invoices tested had proper approvals and three-way match. 2 invoices (8%) lacked proper approval — both were under $500 and processed by a single individual without secondary review.",
        conclusion: "Exception noted — segregation of duties weakness identified for invoices under $500. See Finding FND-001.",
        timeSpentMinutes: 480,
      },
      {
        id: "step-002",
        title: "Payment disbursement authorization",
        population: "All payment runs in Q4 2025 (52 payment runs)",
        sample: "10 payment runs selected judgmentally to cover high-value and month-end runs",
        documentsProvidedBy: "Lisa Wang, AP Manager",
        documentsProvidedDate: "2026-01-28",
        testStepsAndAttributes: "1. Verify dual authorization on payment release\n2. Confirm batch totals reconcile to individual payments\n3. Check for unusual payees or amounts\n4. Verify bank account details match vendor master",
        attachedFiles: [
          { id: "file-003", name: "Payment_Run_Testing.xlsx", type: "spreadsheet" },
        ],
        referencedWorkpapers: ["wp-001"],
        results: "All 10 payment runs had proper dual authorization. Batch totals reconciled. No unusual patterns identified.",
        conclusion: "No exceptions noted. Payment disbursement controls operating effectively.",
        timeSpentMinutes: 360,
      },
    ],
    signoffs: [
      { id: "wp-so-001", signedBy: "Sarah Chen", signedAt: "2026-02-08T16:00:00Z", role: "PREPARER", comment: "Testing complete" },
      { id: "wp-so-002", signedBy: "Marcus Johnson", signedAt: "2026-02-10T11:00:00Z", role: "REVIEWER", comment: "Reviewed — agree with conclusions" },
    ],
    findings: ["FND-001"],
  },
  {
    id: "wp-002",
    engagementId: "eng-001",
    title: "Access Control Review - Financial Systems",
    reference: "WP-002",
    status: "COMPLETED",
    preparedBy: "Sarah Chen",
    preparedDate: "2026-02-05",
    steps: [
      {
        id: "step-003",
        title: "User access rights review",
        population: "All active users in ERP financial module (89 users)",
        sample: "Full population (89 users)",
        documentsProvidedBy: "Tom Nguyen, IT Security",
        documentsProvidedDate: "2026-02-01",
        testStepsAndAttributes: "1. Obtain full user listing with role assignments\n2. Compare roles to job descriptions\n3. Identify users with admin/elevated privileges\n4. Verify terminated employees removed\n5. Check for conflicting role combinations (SOD)",
        attachedFiles: [
          { id: "file-004", name: "ERP_User_Access_List.xlsx", type: "spreadsheet" },
          { id: "file-005", name: "SOD_Conflict_Matrix.xlsx", type: "spreadsheet" },
        ],
        referencedWorkpapers: [],
        results: "7 users had admin privileges (8%). 3 of these could not be justified based on job role. 4 terminated employees still had active accounts (last access dates confirmed no post-termination activity).",
        conclusion: "Exceptions noted — excessive admin privileges and stale accounts. See Findings FND-003 and FND-007.",
        timeSpentMinutes: 600,
      },
    ],
    signoffs: [
      { id: "wp-so-003", signedBy: "Sarah Chen", signedAt: "2026-02-09T15:00:00Z", role: "PREPARER", comment: null },
      { id: "wp-so-004", signedBy: "Marcus Johnson", signedAt: "2026-02-10T14:00:00Z", role: "REVIEWER", comment: "Good work — findings clearly documented" },
    ],
    findings: ["FND-003", "FND-007"],
  },
  {
    id: "wp-003",
    engagementId: "eng-001",
    title: "Journal Entry Testing",
    reference: "WP-003",
    status: "IN_PROGRESS",
    preparedBy: "Sarah Chen",
    preparedDate: "2026-02-12",
    steps: [
      {
        id: "step-004",
        title: "Manual journal entry authorization",
        population: "All manual journal entries posted in Q4 2025 (312 entries)",
        sample: "30 entries selected — 15 high-value (>$100K), 10 month-end, 5 random",
        documentsProvidedBy: "John Martinez, Controller",
        documentsProvidedDate: "2026-02-10",
        testStepsAndAttributes: "1. Verify authorization signature\n2. Confirm supporting documentation attached\n3. Check posting date vs. approval date\n4. Review description for adequacy\n5. Verify reversing entries where applicable",
        attachedFiles: [
          { id: "file-006", name: "JE_Sample_Selection.xlsx", type: "spreadsheet" },
        ],
        referencedWorkpapers: [],
        results: "",
        conclusion: "",
        timeSpentMinutes: 240,
      },
    ],
    signoffs: [],
    findings: [],
  },
];

// =============================================================================
// Mock Findings (enhanced with workflow)
// =============================================================================

export const mockFindings: FindingData[] = [
  {
    id: "FND-001",
    title: "Segregation of duties violation in AP process",
    engagementId: "eng-001",
    engagementTitle: "Q1 2026 Financial Controls Audit",
    workpaperId: "wp-001",
    status: "OPEN" as const,
    workflowStatus: "APPROVED",
    riskRating: "HIGH" as const,
    owner: "John Martinez",
    dueDate: "2026-03-01",
    originalDueDate: null,
    dueDateExtensionReason: null,
    dateIdentified: "2026-01-22",
    description: "Invoices under $500 can be processed by a single individual without secondary review, creating a segregation of duties weakness in the AP process.",
    recommendation: "Implement mandatory secondary approval for all invoices regardless of amount, or establish compensating controls such as daily exception reports reviewed by AP management.",
    managementResponse: null,
    signoffs: [
      { id: "fso-001", signedBy: "Sarah Chen", signedAt: "2026-01-22T14:00:00Z", role: "PREPARER", comment: "Finding documented" },
      { id: "fso-002", signedBy: "Marcus Johnson", signedAt: "2026-01-24T10:00:00Z", role: "REVIEWER", comment: "Confirmed — valid finding" },
      { id: "fso-003", signedBy: "David Kim", signedAt: "2026-01-25T09:00:00Z", role: "APPROVER", comment: null },
    ],
    followUps: [],
  },
  {
    id: "FND-002",
    title: "Missing approval signatures on purchase orders over $50K",
    engagementId: "eng-003",
    engagementTitle: "Procurement Process Audit",
    workpaperId: null,
    status: "IN_REMEDIATION" as const,
    workflowStatus: "APPROVED",
    riskRating: "CRITICAL" as const,
    owner: "Lisa Wang",
    dueDate: "2026-02-15",
    originalDueDate: "2026-01-15",
    dueDateExtensionReason: "Vendor system migration delayed implementation of new approval workflow",
    dateIdentified: "2025-12-10",
    description: "12 of 30 sampled purchase orders over $50K were missing the required VP-level approval signature, representing a 40% exception rate.",
    recommendation: "Enforce mandatory VP approval workflow in the procurement system for all POs exceeding $50K. Implement system controls to prevent PO submission without required approvals.",
    managementResponse: "Agreed. New approval workflow will be implemented as part of the system upgrade currently in progress.",
    signoffs: [
      { id: "fso-010", signedBy: "Emily Rodriguez", signedAt: "2025-12-10T15:00:00Z", role: "PREPARER", comment: null },
      { id: "fso-011", signedBy: "Sarah Chen", signedAt: "2025-12-12T10:00:00Z", role: "REVIEWER", comment: null },
      { id: "fso-012", signedBy: "David Kim", signedAt: "2025-12-13T09:00:00Z", role: "APPROVER", comment: null },
    ],
    followUps: [
      {
        id: "fu-001",
        date: "2026-01-15",
        performedBy: "Emily Rodriguez",
        notes: "Vendor system migration has delayed implementation. Management has requested a 30-day extension. New target date: 2026-02-15.",
        status: "CLOSED",
        evidenceFiles: [{ id: "fu-file-001", name: "Extension_Request_Email.pdf" }],
      },
      {
        id: "fu-002",
        date: "2026-02-10",
        performedBy: "Emily Rodriguez",
        notes: "System upgrade is in UAT phase. New approval workflow has been configured and is being tested. Go-live expected by 2026-02-14.",
        status: "OPEN",
        evidenceFiles: [{ id: "fu-file-002", name: "UAT_Test_Results.pdf" }],
      },
    ],
  },
  {
    id: "FND-003",
    title: "Outdated access control lists for financial systems",
    engagementId: "eng-001",
    engagementTitle: "Q1 2026 Financial Controls Audit",
    workpaperId: "wp-002",
    status: "AWAITING_VALIDATION" as const,
    workflowStatus: "APPROVED",
    riskRating: "MEDIUM" as const,
    owner: "Tom Nguyen",
    dueDate: "2026-02-28",
    originalDueDate: null,
    dueDateExtensionReason: null,
    dateIdentified: "2026-01-18",
    description: "4 terminated employees still had active accounts in the financial ERP system. While no post-termination activity was detected, the access removal process is not timely.",
    recommendation: "Implement automated user deprovisioning tied to HR termination events. Establish monthly access certification process for all financial system users.",
    managementResponse: "Agreed. IT has implemented an automated termination feed from HR system effective immediately.",
    signoffs: [
      { id: "fso-020", signedBy: "Sarah Chen", signedAt: "2026-01-18T14:00:00Z", role: "PREPARER", comment: null },
      { id: "fso-021", signedBy: "Marcus Johnson", signedAt: "2026-01-20T10:00:00Z", role: "REVIEWER", comment: null },
      { id: "fso-022", signedBy: "David Kim", signedAt: "2026-01-21T09:00:00Z", role: "APPROVER", comment: null },
    ],
    followUps: [
      {
        id: "fu-010",
        date: "2026-02-15",
        performedBy: "Sarah Chen",
        notes: "IT confirmed automated feed is active. Reviewed current user list — all 4 terminated accounts have been deactivated. Requesting evidence of monthly certification process.",
        status: "OPEN",
        evidenceFiles: [{ id: "fu-file-010", name: "Termination_Feed_Config.pdf" }],
      },
    ],
  },
  {
    id: "FND-004",
    title: "Incomplete vendor due diligence documentation",
    engagementId: "eng-005",
    engagementTitle: "Vendor Risk Assessment",
    workpaperId: null,
    status: "OPEN" as const,
    workflowStatus: "APPROVED",
    riskRating: "HIGH" as const,
    owner: "Rachel Adams",
    dueDate: "2026-03-15",
    originalDueDate: "2026-02-15",
    dueDateExtensionReason: "Awaiting response from three key vendors on updated compliance questionnaires",
    dateIdentified: "2026-01-05",
    description: "15 of 40 high-risk vendors (37.5%) did not have current due diligence documentation on file. Several vendor files had not been updated since initial onboarding.",
    recommendation: "Establish an annual vendor re-certification program for all high-risk vendors. Implement a vendor management system to track documentation currency and trigger renewal reminders.",
    managementResponse: null,
    signoffs: [
      { id: "fso-030", signedBy: "Sarah Chen", signedAt: "2026-01-05T15:00:00Z", role: "PREPARER", comment: null },
      { id: "fso-031", signedBy: "Emily Rodriguez", signedAt: "2026-01-07T10:00:00Z", role: "REVIEWER", comment: null },
      { id: "fso-032", signedBy: "David Kim", signedAt: "2026-01-08T09:00:00Z", role: "APPROVER", comment: null },
    ],
    followUps: [],
  },
  {
    id: "FND-005",
    title: "Payroll exception report not reviewed monthly",
    engagementId: "eng-004",
    engagementTitle: "HR Payroll Compliance Audit",
    workpaperId: null,
    status: "CLOSED" as const,
    workflowStatus: "CLOSED",
    riskRating: "LOW" as const,
    owner: "Kevin Brown",
    dueDate: "2025-11-30",
    originalDueDate: null,
    dueDateExtensionReason: null,
    dateIdentified: "2025-10-15",
    description: "Monthly payroll exception reports were only reviewed in 7 of 12 months during the audit period.",
    recommendation: "Formalize the exception report review process with documented sign-off and escalation procedures for identified exceptions.",
    managementResponse: "Implemented monthly calendar reminders and designated a backup reviewer. Review checklist has been created.",
    signoffs: [
      { id: "fso-040", signedBy: "David Kim", signedAt: "2025-10-15T14:00:00Z", role: "PREPARER", comment: null },
      { id: "fso-041", signedBy: "Sarah Chen", signedAt: "2025-10-17T10:00:00Z", role: "REVIEWER", comment: null },
      { id: "fso-042", signedBy: "Emily Rodriguez", signedAt: "2025-10-18T09:00:00Z", role: "APPROVER", comment: null },
    ],
    followUps: [
      {
        id: "fu-020",
        date: "2025-11-20",
        performedBy: "David Kim",
        notes: "Verified that exception reports for October and November were reviewed timely with documented sign-off. New process is working as designed.",
        status: "CLOSED",
        evidenceFiles: [
          { id: "fu-file-020", name: "Oct_Exception_Report_Signoff.pdf" },
          { id: "fu-file-021", name: "Nov_Exception_Report_Signoff.pdf" },
        ],
      },
    ],
  },
  {
    id: "FND-006",
    title: "No encryption at rest for sensitive vendor data",
    engagementId: "eng-005",
    engagementTitle: "Vendor Risk Assessment",
    workpaperId: null,
    status: "OPEN" as const,
    workflowStatus: "APPROVED",
    riskRating: "CRITICAL" as const,
    owner: "Tom Nguyen",
    dueDate: "2026-02-20",
    originalDueDate: null,
    dueDateExtensionReason: null,
    dateIdentified: "2026-01-12",
    description: "Vendor master data containing bank account information and tax IDs is stored in an unencrypted database. This data is accessible to 23 users with database-level access.",
    recommendation: "Enable transparent data encryption (TDE) on the vendor master database immediately. Review and restrict database-level access to essential personnel only.",
    managementResponse: null,
    signoffs: [
      { id: "fso-050", signedBy: "Sarah Chen", signedAt: "2026-01-12T16:00:00Z", role: "PREPARER", comment: null },
      { id: "fso-051", signedBy: "Marcus Johnson", signedAt: "2026-01-14T10:00:00Z", role: "REVIEWER", comment: "Escalated to CISO" },
      { id: "fso-052", signedBy: "David Kim", signedAt: "2026-01-15T09:00:00Z", role: "APPROVER", comment: null },
    ],
    followUps: [],
  },
  {
    id: "FND-007",
    title: "Excessive admin privileges on ERP system",
    engagementId: "eng-001",
    engagementTitle: "Q1 2026 Financial Controls Audit",
    workpaperId: "wp-002",
    status: "IN_REMEDIATION" as const,
    workflowStatus: "APPROVED",
    riskRating: "HIGH" as const,
    owner: "Lisa Wang",
    dueDate: "2026-03-10",
    originalDueDate: "2026-02-10",
    dueDateExtensionReason: "ERP vendor requires additional lead time for privilege restructuring in production",
    dateIdentified: "2026-01-25",
    description: "3 users had ERP admin privileges that could not be justified based on their job roles. These users had the ability to create vendors, approve payments, and modify GL configurations.",
    recommendation: "Remove unjustified admin privileges immediately. Implement quarterly access reviews with documented approval from data owners.",
    managementResponse: "Agreed. Temporary admin access has been revoked for 2 of 3 users. Working with ERP vendor on role restructuring for the third.",
    signoffs: [
      { id: "fso-060", signedBy: "Sarah Chen", signedAt: "2026-01-25T15:00:00Z", role: "PREPARER", comment: null },
      { id: "fso-061", signedBy: "Marcus Johnson", signedAt: "2026-01-27T10:00:00Z", role: "REVIEWER", comment: null },
      { id: "fso-062", signedBy: "David Kim", signedAt: "2026-01-28T09:00:00Z", role: "APPROVER", comment: null },
    ],
    followUps: [
      {
        id: "fu-030",
        date: "2026-02-10",
        performedBy: "Sarah Chen",
        notes: "2 of 3 users have had admin access revoked. Third user's role restructuring requires ERP vendor involvement. Extension requested.",
        status: "OPEN",
        evidenceFiles: [{ id: "fu-file-030", name: "Access_Revocation_Evidence.pdf" }],
      },
    ],
  },
];

// =============================================================================
// Dashboard Stats (computed)
// =============================================================================

export const dashboardStats = {
  activeEngagements: mockEngagements.filter((e) =>
    ["PLANNING", "FIELDWORK", "REVIEW", "REPORTING"].includes(e.status)
  ).length,
  openFindings: mockFindings.filter((f) => f.status === "OPEN").length,
  criticalFindings: mockFindings.filter((f) => f.riskRating === "CRITICAL" && f.status !== "CLOSED").length,
  completionRate: 72,
  overdueFindings: mockFindings.filter(
    (f) => f.status !== "CLOSED" && f.dueDate < "2026-02-19"
  ).length,
  findingsByRisk: {
    CRITICAL: mockFindings.filter((f) => f.riskRating === "CRITICAL").length,
    HIGH: mockFindings.filter((f) => f.riskRating === "HIGH").length,
    MEDIUM: mockFindings.filter((f) => f.riskRating === "MEDIUM").length,
    LOW: mockFindings.filter((f) => f.riskRating === "LOW").length,
  },
  engagementsByStatus: {
    PLANNING: mockEngagements.filter((e) => e.status === "PLANNING").length,
    FIELDWORK: mockEngagements.filter((e) => e.status === "FIELDWORK").length,
    REVIEW: mockEngagements.filter((e) => e.status === "REVIEW").length,
    REPORTING: mockEngagements.filter((e) => e.status === "REPORTING").length,
    COMPLETED: mockEngagements.filter((e) => e.status === "COMPLETED").length,
  },
};

// =============================================================================
// Helpers
// =============================================================================

export function getAuditGroupLabel(group: AuditGroup): string {
  return AUDIT_GROUPS.find((g) => g.key === group)?.label ?? group;
}

export function getAuditYears(): number[] {
  const years = [...new Set(mockEngagements.map((e) => e.auditYear))];
  return years.sort((a, b) => b - a);
}

export function getEngagementsByYearAndGroup(): Record<number, Record<AuditGroup, Engagement[]>> {
  const result: Record<number, Record<AuditGroup, Engagement[]>> = {};
  for (const eng of mockEngagements) {
    if (!result[eng.auditYear]) {
      result[eng.auditYear] = { CORPORATE_RBA: [], IS_RBA: [], MAR: [], SOC: [] };
    }
    result[eng.auditYear][eng.auditGroup].push(eng);
  }
  return result;
}

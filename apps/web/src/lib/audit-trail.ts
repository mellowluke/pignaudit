// =============================================================================
// Audit Trail & Policy Engine
// =============================================================================
// Full traceability for every document and status change within an engagement.
// The policy engine evaluates data-driven rules against trail events and
// produces flags when constraints are violated or noteworthy conditions occur.
//
// Architecture:
//   AuditTrailEvent  — immutable log of every change
//   PolicyRule        — configurable constraint tied back to policy
//   PolicyFlag        — produced when a rule fires against an event
//
// Currently runs client-side with in-memory state (mock). The same rule
// definitions and evaluation logic will move server-side when the API layer
// is built — the shapes are identical to the Prisma models.
// =============================================================================

// ---------------------------------------------------------------------------
// Types (mirror Prisma models)
// ---------------------------------------------------------------------------

export type PolicySeverity = "INFO" | "WARNING" | "VIOLATION";

export interface AuditTrailEvent {
  id: string;
  engagementId: string;
  eventType: string;
  category: string | null;
  targetId: string | null;
  targetName: string | null;
  metadata: Record<string, unknown> | null;
  actorName: string;
  createdAt: string;
}

export interface PolicyRule {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  triggerEvent: string;
  condition: PolicyCondition;
  severity: PolicySeverity;
  enabled: boolean;
}

export interface PolicyFlag {
  id: string;
  engagementId: string;
  policyRuleCode: string;
  policyRuleName: string;
  eventId: string;
  severity: PolicySeverity;
  message: string;
  resolved: boolean;
  resolvedNote: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Condition types — extensible union
// ---------------------------------------------------------------------------

export type PolicyCondition =
  | PhaseGateCondition
  | RetroactiveChangeCondition
  | RequiredDocumentCondition
  | ApprovalRequiredCondition;

interface PhaseGateCondition {
  type: "phase_gate";
  documentCategory: string;
  requiredPhase: string;
  requiredPhaseOrder: number;
}

interface RetroactiveChangeCondition {
  type: "retroactive_change";
  documentCategory: string;
  dependentCategories: string[];
}

interface RequiredDocumentCondition {
  type: "required_document";
  requiredInPhase: string;
  documentCategory: string;
  minCount: number;
}

interface ApprovalRequiredCondition {
  type: "approval_required";
  documentCategory: string;
  forPhaseTransition: string;
}

// ---------------------------------------------------------------------------
// Phase ordering (canonical)
// ---------------------------------------------------------------------------

export const PHASE_ORDER: Record<string, number> = {
  PLANNING: 1,
  FIELDWORK: 2,
  REVIEW: 3,
  REPORTING: 4,
  COMPLETED: 5,
  CANCELLED: 6,
};

// ---------------------------------------------------------------------------
// Default policy rules — these ship with the system
// ---------------------------------------------------------------------------

export const DEFAULT_POLICY_RULES: PolicyRule[] = [
  {
    id: "rule-001",
    code: "TESTING_REQUIRES_FIELDWORK",
    name: "Testing documents require Fieldwork phase",
    description:
      "Testing documents (work programs, sample evidence, test results) cannot be uploaded until the engagement has entered the Fieldwork phase. IIA Standard 2300 requires fieldwork to be formally initiated before audit evidence is gathered.",
    category: "PHASE_GATE",
    triggerEvent: "DOCUMENT_UPLOADED",
    condition: {
      type: "phase_gate",
      documentCategory: "TESTING",
      requiredPhase: "FIELDWORK",
      requiredPhaseOrder: 2,
    },
    severity: "VIOLATION",
    enabled: true,
  },
  {
    id: "rule-002",
    code: "FINDINGS_REQUIRE_REVIEW",
    name: "Findings documents require Review phase or later",
    description:
      "Finding write-ups and management responses should not be uploaded until the engagement has reached the Review phase. Per audit methodology, findings must be vetted through quality review before formalization.",
    category: "PHASE_GATE",
    triggerEvent: "DOCUMENT_UPLOADED",
    condition: {
      type: "phase_gate",
      documentCategory: "FINDINGS",
      requiredPhase: "REVIEW",
      requiredPhaseOrder: 3,
    },
    severity: "WARNING",
    enabled: true,
  },
  {
    id: "rule-003",
    code: "DOCUMENTATION_RETROACTIVE_CHANGE",
    name: "Documentation changed after dependent work started",
    description:
      "When documentation (audit plans, scope memos) is modified after testing or findings documents already exist, this may indicate a scope change that requires re-evaluation of dependent work products.",
    category: "DOCUMENT_CONTROL",
    triggerEvent: "DOCUMENT_UPLOADED",
    condition: {
      type: "retroactive_change",
      documentCategory: "DOCUMENTATION",
      dependentCategories: ["TESTING", "FINDINGS"],
    },
    severity: "WARNING",
    enabled: true,
  },
  {
    id: "rule-004",
    code: "TESTING_RETROACTIVE_CHANGE",
    name: "Testing documents changed after findings exist",
    description:
      "When testing evidence is modified after findings have been documented, the affected findings should be reviewed to ensure they still accurately reflect the test results.",
    category: "DOCUMENT_CONTROL",
    triggerEvent: "DOCUMENT_UPLOADED",
    condition: {
      type: "retroactive_change",
      documentCategory: "TESTING",
      dependentCategories: ["FINDINGS"],
    },
    severity: "WARNING",
    enabled: true,
  },
  {
    id: "rule-005",
    code: "DOCUMENT_REMOVED_AFTER_REVIEW",
    name: "Document removed after Review phase",
    description:
      "Removing documents after the engagement has entered Review or later phases may compromise the audit trail integrity. All removals during these phases must be justified.",
    category: "DOCUMENT_CONTROL",
    triggerEvent: "DOCUMENT_REMOVED",
    condition: {
      type: "phase_gate",
      documentCategory: "*",
      requiredPhase: "REVIEW",
      requiredPhaseOrder: 3,
    },
    severity: "VIOLATION",
    enabled: true,
  },
  {
    id: "rule-006",
    code: "PLANNING_DOCS_BEFORE_FIELDWORK",
    name: "Planning documentation required before Fieldwork",
    description:
      "At least one documentation artifact (audit plan, scope memo) must be uploaded before the engagement can progress to Fieldwork. Per IIA Standard 2200, engagement planning must be documented.",
    category: "PHASE_GATE",
    triggerEvent: "STATUS_CHANGED",
    condition: {
      type: "required_document",
      requiredInPhase: "FIELDWORK",
      documentCategory: "DOCUMENTATION",
      minCount: 1,
    },
    severity: "WARNING",
    enabled: true,
  },
];

// ---------------------------------------------------------------------------
// Policy Engine — evaluates rules against events
// ---------------------------------------------------------------------------

interface EvaluationContext {
  engagementStatus: string;
  documentCounts: Record<string, number>;
}

export function evaluatePolicies(
  event: AuditTrailEvent,
  context: EvaluationContext,
  rules: PolicyRule[] = DEFAULT_POLICY_RULES
): PolicyFlag[] {
  const flags: PolicyFlag[] = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;
    if (rule.triggerEvent !== event.eventType) continue;

    const flag = evaluateRule(rule, event, context);
    if (flag) {
      flags.push(flag);
    }
  }

  return flags;
}

function evaluateRule(
  rule: PolicyRule,
  event: AuditTrailEvent,
  context: EvaluationContext
): PolicyFlag | null {
  const condition = rule.condition;

  switch (condition.type) {
    case "phase_gate":
      return evaluatePhaseGate(rule, event, condition, context);
    case "retroactive_change":
      return evaluateRetroactiveChange(rule, event, condition, context);
    case "required_document":
      return evaluateRequiredDocument(rule, event, condition, context);
    case "approval_required":
      return null; // placeholder for future implementation
    default:
      return null;
  }
}

function evaluatePhaseGate(
  rule: PolicyRule,
  event: AuditTrailEvent,
  condition: PhaseGateCondition,
  context: EvaluationContext
): PolicyFlag | null {
  // For DOCUMENT_REMOVED events with wildcard category: check if current phase >= required
  if (
    rule.triggerEvent === "DOCUMENT_REMOVED" &&
    condition.documentCategory === "*"
  ) {
    const currentOrder = PHASE_ORDER[context.engagementStatus] ?? 0;
    if (currentOrder >= condition.requiredPhaseOrder) {
      return createFlag(
        rule,
        event,
        `Document "${event.targetName}" was removed during ${context.engagementStatus} phase. ` +
          `Policy "${rule.name}" requires justification for document removal at this stage.`
      );
    }
    return null;
  }

  // For uploads: check document category matches and phase hasn't been reached
  if (
    event.category?.toUpperCase() !== condition.documentCategory.toUpperCase()
  ) {
    return null;
  }

  const currentOrder = PHASE_ORDER[context.engagementStatus] ?? 0;
  if (currentOrder < condition.requiredPhaseOrder) {
    return createFlag(
      rule,
      event,
      `"${event.targetName}" uploaded to ${event.category} while engagement is in ${context.engagementStatus}. ` +
        `Policy "${rule.name}" requires the engagement to be in ${condition.requiredPhase} or later.`
    );
  }

  return null;
}

function evaluateRetroactiveChange(
  rule: PolicyRule,
  event: AuditTrailEvent,
  condition: RetroactiveChangeCondition,
  context: EvaluationContext
): PolicyFlag | null {
  if (
    event.category?.toUpperCase() !== condition.documentCategory.toUpperCase()
  ) {
    return null;
  }

  // Check if any dependent category already has documents
  const hasDependent = condition.dependentCategories.some(
    (cat) => (context.documentCounts[cat] ?? 0) > 0
  );

  if (hasDependent) {
    const deps = condition.dependentCategories
      .filter((cat) => (context.documentCounts[cat] ?? 0) > 0)
      .join(", ");
    return createFlag(
      rule,
      event,
      `"${event.targetName}" added to ${event.category} after dependent documents already exist in: ${deps}. ` +
        `Policy "${rule.name}" — dependent work products should be reviewed for impact.`
    );
  }

  return null;
}

function evaluateRequiredDocument(
  rule: PolicyRule,
  event: AuditTrailEvent,
  condition: RequiredDocumentCondition,
  context: EvaluationContext
): PolicyFlag | null {
  // Only applies to STATUS_CHANGED events
  const newStatus = (event.metadata as Record<string, unknown>)?.newStatus as string | undefined;
  if (newStatus !== condition.requiredInPhase) return null;

  const count = context.documentCounts[condition.documentCategory] ?? 0;
  if (count < condition.minCount) {
    return createFlag(
      rule,
      event,
      `Engagement moved to ${newStatus} but only ${count} ${condition.documentCategory.toLowerCase()} document(s) exist ` +
        `(minimum ${condition.minCount} required). Policy "${rule.name}".`
    );
  }

  return null;
}

function createFlag(
  rule: PolicyRule,
  event: AuditTrailEvent,
  message: string
): PolicyFlag {
  return {
    id: `flag-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    engagementId: event.engagementId,
    policyRuleCode: rule.code,
    policyRuleName: rule.name,
    eventId: event.id,
    severity: rule.severity,
    message,
    resolved: false,
    resolvedNote: null,
    createdAt: event.createdAt,
  };
}

// ---------------------------------------------------------------------------
// Audit Trail Store (in-memory mock — will become API calls)
// ---------------------------------------------------------------------------

export interface AuditTrailStore {
  events: AuditTrailEvent[];
  flags: PolicyFlag[];
}

export function createEvent(
  engagementId: string,
  eventType: string,
  opts: {
    category?: string;
    targetId?: string;
    targetName?: string;
    metadata?: Record<string, unknown>;
    actorName?: string;
  }
): AuditTrailEvent {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    engagementId,
    eventType,
    category: opts.category ?? null,
    targetId: opts.targetId ?? null,
    targetName: opts.targetName ?? null,
    metadata: opts.metadata ?? null,
    actorName: opts.actorName ?? "Current User",
    createdAt: new Date().toISOString(),
  };
}

export function recordEventAndEvaluate(
  store: AuditTrailStore,
  event: AuditTrailEvent,
  context: EvaluationContext
): { newFlags: PolicyFlag[] } {
  store.events.push(event);

  const newFlags = evaluatePolicies(event, context);
  store.flags.push(...newFlags);

  return { newFlags };
}

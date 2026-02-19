"use client";

import { useState } from "react";
import {
  type PolicyRule,
  type PolicySeverity,
  type PolicyCondition,
  DEFAULT_POLICY_RULES,
  PHASE_ORDER,
} from "@/lib/audit-trail";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEVERITY_OPTIONS: PolicySeverity[] = ["INFO", "WARNING", "VIOLATION"];

const SEVERITY_STYLES: Record<
  PolicySeverity,
  { bg: string; text: string; dot: string }
> = {
  INFO: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  WARNING: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  VIOLATION: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const CATEGORY_OPTIONS = [
  "PHASE_GATE",
  "DOCUMENT_CONTROL",
  "APPROVAL_REQUIRED",
  "RETENTION",
];

const TRIGGER_OPTIONS = [
  "DOCUMENT_UPLOADED",
  "DOCUMENT_REMOVED",
  "DOCUMENT_REPLACED",
  "STATUS_CHANGED",
];

const CONDITION_TYPE_OPTIONS = [
  { value: "phase_gate", label: "Phase Gate" },
  { value: "retroactive_change", label: "Retroactive Change" },
  { value: "required_document", label: "Required Document" },
  { value: "approval_required", label: "Approval Required" },
];

const DOC_CATEGORIES = ["DOCUMENTATION", "TESTING", "FINDINGS", "*"];
const PHASES = Object.keys(PHASE_ORDER);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PolicyRulesAdminPage() {
  const [rules, setRules] = useState<PolicyRule[]>(() =>
    DEFAULT_POLICY_RULES.map((r) => ({ ...r }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const toggleEnabled = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const updateRule = (updated: PolicyRule) => {
    setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditingId(null);
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    setEditingId(null);
  };

  const addRule = (rule: PolicyRule) => {
    setRules((prev) => [...prev, rule]);
    setShowNewForm(false);
  };

  const enabledCount = rules.filter((r) => r.enabled).length;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Rules</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure the rules that govern audit engagement traceability. Rules
            are evaluated automatically when documents are uploaded, removed, or
            engagement status changes.
          </p>
        </div>
        <button
          onClick={() => {
            setShowNewForm(true);
            setEditingId(null);
          }}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          + Add Rule
        </button>
      </div>

      {/* Summary strip */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Total Rules</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {rules.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Enabled</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {enabledCount}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Violations</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {rules.filter((r) => r.severity === "VIOLATION" && r.enabled).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Warnings</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {rules.filter((r) => r.severity === "WARNING" && r.enabled).length}
          </p>
        </div>
      </div>

      {/* New rule form */}
      {showNewForm && (
        <div className="mb-6">
          <RuleForm
            onSave={addRule}
            onCancel={() => setShowNewForm(false)}
          />
        </div>
      )}

      {/* Rules list */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id}>
            {editingId === rule.id ? (
              <RuleForm
                rule={rule}
                onSave={updateRule}
                onCancel={() => setEditingId(null)}
                onDelete={() => deleteRule(rule.id)}
              />
            ) : (
              <RuleCard
                rule={rule}
                onToggle={() => toggleEnabled(rule.id)}
                onEdit={() => {
                  setEditingId(rule.id);
                  setShowNewForm(false);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-sm text-gray-500">No policy rules configured</p>
            <button
              onClick={() => setShowNewForm(true)}
              className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Add your first rule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rule card (read-only view)
// ---------------------------------------------------------------------------

function RuleCard({
  rule,
  onToggle,
  onEdit,
}: {
  rule: PolicyRule;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const s = SEVERITY_STYLES[rule.severity];
  const condType = rule.condition.type.replace(/_/g, " ");

  return (
    <div
      className={`rounded-lg border bg-white transition-opacity ${rule.enabled ? "border-gray-200" : "border-gray-100 opacity-60"}`}
    >
      <div className="flex items-start gap-4 px-5 py-4">
        {/* Toggle */}
        <button
          onClick={onToggle}
          className="mt-1 flex-shrink-0"
          title={rule.enabled ? "Disable rule" : "Enable rule"}
        >
          <div
            className={`relative h-5 w-9 rounded-full transition-colors ${rule.enabled ? "bg-indigo-600" : "bg-gray-300"}`}
          >
            <div
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${rule.enabled ? "left-[18px]" : "left-0.5"}`}
            />
          </div>
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {rule.name}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {rule.severity}
            </span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
              {rule.category}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">{rule.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
              Trigger: {rule.triggerEvent}
            </span>
            <span className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
              Condition: {condType}
            </span>
            <span className="rounded bg-gray-50 px-2 py-0.5 text-xs font-mono text-gray-600">
              {rule.code}
            </span>
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={onEdit}
          className="flex-shrink-0 rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="Edit rule"
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rule form (create / edit)
// ---------------------------------------------------------------------------

function buildDefaultCondition(type: string): PolicyCondition {
  switch (type) {
    case "phase_gate":
      return {
        type: "phase_gate",
        documentCategory: "TESTING",
        requiredPhase: "FIELDWORK",
        requiredPhaseOrder: PHASE_ORDER["FIELDWORK"],
      };
    case "retroactive_change":
      return {
        type: "retroactive_change",
        documentCategory: "DOCUMENTATION",
        dependentCategories: ["TESTING"],
      };
    case "required_document":
      return {
        type: "required_document",
        requiredInPhase: "FIELDWORK",
        documentCategory: "DOCUMENTATION",
        minCount: 1,
      };
    case "approval_required":
      return {
        type: "approval_required",
        documentCategory: "DOCUMENTATION",
        forPhaseTransition: "REVIEW",
      };
    default:
      return {
        type: "phase_gate",
        documentCategory: "TESTING",
        requiredPhase: "FIELDWORK",
        requiredPhaseOrder: PHASE_ORDER["FIELDWORK"],
      };
  }
}

function RuleForm({
  rule,
  onSave,
  onCancel,
  onDelete,
}: {
  rule?: PolicyRule;
  onSave: (rule: PolicyRule) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const isNew = !rule;
  const [code, setCode] = useState(rule?.code ?? "");
  const [name, setName] = useState(rule?.name ?? "");
  const [description, setDescription] = useState(rule?.description ?? "");
  const [category, setCategory] = useState(rule?.category ?? "PHASE_GATE");
  const [triggerEvent, setTriggerEvent] = useState(
    rule?.triggerEvent ?? "DOCUMENT_UPLOADED"
  );
  const [severity, setSeverity] = useState<PolicySeverity>(
    rule?.severity ?? "WARNING"
  );
  const [conditionType, setConditionType] = useState<PolicyCondition["type"]>(
    rule?.condition.type ?? "phase_gate"
  );
  const [condition, setCondition] = useState<PolicyCondition>(
    rule?.condition ?? buildDefaultCondition("phase_gate")
  );

  const handleConditionTypeChange = (type: PolicyCondition["type"]) => {
    setConditionType(type);
    setCondition(buildDefaultCondition(type));
  };

  const handleSave = () => {
    if (!code.trim() || !name.trim()) return;
    onSave({
      id: rule?.id ?? `rule-${Date.now()}`,
      code: code.trim().toUpperCase().replace(/\s+/g, "_"),
      name: name.trim(),
      description: description.trim(),
      category,
      triggerEvent,
      condition,
      severity,
      enabled: rule?.enabled ?? true,
    });
  };

  return (
    <div className="rounded-lg border-2 border-indigo-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        {isNew ? "New Policy Rule" : "Edit Policy Rule"}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Code */}
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Rule Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. TESTING_REQUIRES_FIELDWORK"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Human-readable rule name"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700">
            Description / Policy Reference
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Explain the policy basis for this rule (e.g. IIA Standard 2300)"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Trigger Event */}
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Trigger Event
          </label>
          <select
            value={triggerEvent}
            onChange={(e) => setTriggerEvent(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {TRIGGER_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Severity
          </label>
          <div className="mt-1 flex gap-2">
            {SEVERITY_OPTIONS.map((s) => {
              const style = SEVERITY_STYLES[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                    severity === s
                      ? `${style.bg} ${style.text} border-current`
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Condition Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Condition Type
          </label>
          <select
            value={conditionType}
            onChange={(e) => handleConditionTypeChange(e.target.value as PolicyCondition["type"])}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {CONDITION_TYPE_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Condition fields */}
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase text-gray-500">
            Condition Parameters
          </p>
          <ConditionFields
            condition={condition}
            onChange={setCondition}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete Rule
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!code.trim() || !name.trim()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNew ? "Add Rule" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Condition-specific form fields
// ---------------------------------------------------------------------------

function ConditionFields({
  condition,
  onChange,
}: {
  condition: PolicyCondition;
  onChange: (c: PolicyCondition) => void;
}) {
  switch (condition.type) {
    case "phase_gate":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-gray-600">
              Document Category
            </label>
            <select
              value={condition.documentCategory}
              onChange={(e) =>
                onChange({ ...condition, documentCategory: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              {DOC_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === "*" ? "ALL (*)" : c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">
              Required Phase
            </label>
            <select
              value={condition.requiredPhase}
              onChange={(e) =>
                onChange({
                  ...condition,
                  requiredPhase: e.target.value,
                  requiredPhaseOrder: PHASE_ORDER[e.target.value] ?? 1,
                })
              }
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p} (order {PHASE_ORDER[p]})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">Phase Order</label>
            <input
              type="number"
              value={condition.requiredPhaseOrder}
              readOnly
              className="mt-1 w-full rounded border border-gray-200 bg-gray-100 px-2 py-1.5 text-sm text-gray-500"
            />
          </div>
        </div>
      );

    case "retroactive_change":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-600">
              Document Category (source)
            </label>
            <select
              value={condition.documentCategory}
              onChange={(e) =>
                onChange({ ...condition, documentCategory: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              {DOC_CATEGORIES.filter((c) => c !== "*").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">
              Dependent Categories
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {DOC_CATEGORIES.filter((c) => c !== "*").map((c) => {
                const selected = condition.dependentCategories.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const deps = selected
                        ? condition.dependentCategories.filter(
                            (d) => d !== c
                          )
                        : [...condition.dependentCategories, c];
                      onChange({ ...condition, dependentCategories: deps });
                    }}
                    className={`rounded border px-2 py-1 text-xs font-medium transition-colors ${
                      selected
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );

    case "required_document":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-gray-600">
              Required In Phase
            </label>
            <select
              value={condition.requiredInPhase}
              onChange={(e) =>
                onChange({ ...condition, requiredInPhase: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">
              Document Category
            </label>
            <select
              value={condition.documentCategory}
              onChange={(e) =>
                onChange({ ...condition, documentCategory: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              {DOC_CATEGORIES.filter((c) => c !== "*").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">Min Count</label>
            <input
              type="number"
              min={1}
              value={condition.minCount}
              onChange={(e) =>
                onChange({
                  ...condition,
                  minCount: parseInt(e.target.value) || 1,
                })
              }
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>
      );

    case "approval_required":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-600">
              Document Category
            </label>
            <select
              value={condition.documentCategory}
              onChange={(e) =>
                onChange({ ...condition, documentCategory: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              {DOC_CATEGORIES.filter((c) => c !== "*").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">
              For Phase Transition
            </label>
            <select
              value={condition.forPhaseTransition}
              onChange={(e) =>
                onChange({
                  ...condition,
                  forPhaseTransition: e.target.value,
                })
              }
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
  }
}

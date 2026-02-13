import Link from "next/link";
import { mockFindings } from "@/lib/mock-data";
import { StatusBadge, RiskBadge } from "@/components/status-badge";

export default function FindingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Findings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage audit findings across all engagements
        </p>
      </div>

      {/* Summary strip */}
      <div className="mb-6 flex gap-3">
        {[
          { label: "Open", count: mockFindings.filter((f) => f.status === "OPEN").length, color: "red" },
          { label: "In Remediation", count: mockFindings.filter((f) => f.status === "IN_REMEDIATION").length, color: "yellow" },
          { label: "Awaiting Validation", count: mockFindings.filter((f) => f.status === "AWAITING_VALIDATION").length, color: "blue" },
          { label: "Closed", count: mockFindings.filter((f) => f.status === "CLOSED").length, color: "green" },
        ].map((s) => {
          const colors: Record<string, string> = {
            red: "border-red-200 bg-red-50 text-red-700",
            yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
            blue: "border-blue-200 bg-blue-50 text-blue-700",
            green: "border-green-200 bg-green-50 text-green-700",
          };
          return (
            <div
              key={s.label}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${colors[s.color]}`}
            >
              <span className="text-xl font-bold">{s.count}</span>
              <span className="text-sm font-medium">{s.label}</span>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Finding
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Risk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockFindings.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-indigo-600">
                  <Link href={`/findings/${f.id}`}>{f.id}</Link>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/findings/${f.id}`} className="block">
                    <p className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                      {f.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {f.engagementTitle}
                    </p>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={f.status} />
                </td>
                <td className="px-6 py-4">
                  <RiskBadge risk={f.riskRating} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {f.owner}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {f.dueDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const reports = [
    {
      id: "RPT-001",
      title: "HR Payroll Compliance Audit - Final Report",
      engagement: "HR Payroll Compliance Audit",
      type: "Final Report",
      date: "2025-12-20",
      status: "Published",
    },
    {
      id: "RPT-002",
      title: "Vendor Risk Assessment - Draft Report",
      engagement: "Vendor Risk Assessment",
      type: "Draft Report",
      date: "2026-02-10",
      status: "Draft",
    },
    {
      id: "RPT-003",
      title: "Procurement Process Audit - Draft Report",
      engagement: "Procurement Process Audit",
      type: "Draft Report",
      date: "2026-01-28",
      status: "Under Review",
    },
    {
      id: "RPT-004",
      title: "Q4 2025 Audit Committee Summary",
      engagement: "Multiple",
      type: "Summary Report",
      date: "2025-12-31",
      status: "Published",
    },
  ];

  const statusStyles: Record<string, string> = {
    Published: "bg-green-100 text-green-700",
    Draft: "bg-gray-100 text-gray-700",
    "Under Review": "bg-yellow-100 text-yellow-700",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Audit reports and committee summaries
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-lg border border-gray-200 bg-white p-6 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{report.title}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {report.engagement} &middot; {report.date}
                </p>
              </div>
              <span
                className={`ml-3 inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[report.status]}`}
              >
                {report.status}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center rounded border border-gray-200 px-2 py-1 text-xs text-gray-500">
                {report.type}
              </span>
              <button className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-500">
                <svg className="mr-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

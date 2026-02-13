"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewEngagementPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => router.push("/engagements"), 1500);
  }

  if (submitted) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-900">Engagement Created</p>
        <p className="text-sm text-gray-500">Redirecting to engagements...</p>
      </div>
    );
  }

  return (
    <div>
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
        <h1 className="text-2xl font-bold text-gray-900">New Engagement</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new audit engagement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Engagement Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Q2 2026 Financial Controls Audit"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department"
              name="department"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select department</option>
              <option>Finance</option>
              <option>Information Technology</option>
              <option>Operations</option>
              <option>Human Resources</option>
              <option>Supply Chain</option>
              <option>Legal &amp; Compliance</option>
            </select>
          </div>

          <div>
            <label htmlFor="riskRating" className="block text-sm font-medium text-gray-700">
              Risk Rating
            </label>
            <select
              id="riskRating"
              name="riskRating"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select risk rating</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="leadAuditor" className="block text-sm font-medium text-gray-700">
              Lead Auditor
            </label>
            <select
              id="leadAuditor"
              name="leadAuditor"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select lead auditor</option>
              <option>Sarah Chen</option>
              <option>Marcus Johnson</option>
              <option>Emily Rodriguez</option>
              <option>David Kim</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe the scope and objectives of this engagement..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Create Engagement
          </button>
          <Link
            href="/engagements"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

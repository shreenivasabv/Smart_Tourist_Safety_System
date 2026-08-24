import React, { useCallback, useEffect, useState } from "react";
import { FaDownload, FaFileCsv, FaSyncAlt } from "react-icons/fa";
import { getOperationsSnapshot } from "../../services/operationsService";

const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const downloadCsv = (filename, columns, rows) => {
  const content = [columns.map((column) => escapeCsv(column.label)).join(","), ...rows.map((row) => columns.map((column) => escapeCsv(column.get(row))).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
};

export default function ReportsDashboard() {
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); setError(""); try { setSnapshot(await getOperationsSnapshot()); } catch { setError("Report data could not be loaded. Check that the backend is running."); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <p className="py-10 text-center text-sm text-slate-500">Preparing report data…</p>;
  if (error) return <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}<button onClick={load} className="ml-3 underline">Try again</button></div>;

  const { tourists, incidents, stats } = snapshot;
  const stamp = new Date().toISOString().slice(0, 10);
  const reports = [
    { title: "Tourist safety register", description: "Current registration, risk, zone and connectivity status.", count: `${tourists.length} tourists`, action: () => downloadCsv(`tourist-safety-register-${stamp}.csv`, [{ label: "Name", get: (t) => t.fullName }, { label: "Email", get: (t) => t.email }, { label: "Phone", get: (t) => t.phone }, { label: "Risk level", get: (t) => t.riskLevel }, { label: "Zone status", get: (t) => t.zoneStatus }, { label: "Last seen", get: (t) => t.lastSeen }], tourists) },
    { title: "Incident response log", description: "All incident records, including priority and response state.", count: `${incidents.length} incidents`, action: () => downloadCsv(`incident-response-log-${stamp}.csv`, [{ label: "Reference", get: (i) => i.reference }, { label: "Title", get: (i) => i.title }, { label: "Priority", get: (i) => i.priority }, { label: "Status", get: (i) => i.status }, { label: "Tourist", get: (i) => i.touristName || i.tourist?.fullName }, { label: "Created", get: (i) => i.createdAt }, { label: "Resolved", get: (i) => i.resolvedAt }], incidents) },
    { title: "Safety overview", description: "A concise current snapshot for shift handover and coordination.", count: "Live snapshot", action: () => downloadCsv(`safety-overview-${stamp}.csv`, [{ label: "Metric", get: (r) => r.metric }, { label: "Value", get: (r) => r.value }], [{ metric: "Registered tourists", value: stats.totalTourists }, { metric: "Online tourists", value: stats.activeTourists }, { metric: "Outside safe zone", value: stats.outsideSafeZone }, { metric: "High risk", value: stats.riskLevel.high }, { metric: "Active geofences", value: stats.geoFenceRulesPlanned }, { metric: "Generated at", value: stats.generatedAt }]) },
  ];
  return <div className="space-y-5"><div className="flex justify-end"><button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><FaSyncAlt /> Refresh data</button></div><div className="grid gap-4 lg:grid-cols-3">{reports.map((report) => <article key={report.title} className="flex flex-col rounded-xl border border-slate-200 p-5"><FaFileCsv className="text-2xl text-emerald-600" /><h3 className="mt-4 font-semibold text-slate-800">{report.title}</h3><p className="mt-2 flex-1 text-sm text-slate-500">{report.description}</p><p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">{report.count}</p><button onClick={report.action} className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"><FaDownload /> Download CSV</button></article>)}</div></div>;
}

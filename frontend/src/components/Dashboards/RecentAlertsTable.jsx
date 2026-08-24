import { useEffect, useState } from "react";
import { getIncidents } from "../../services/incidentService";

const badge = (status) => ({ open: "bg-rose-600", acknowledged: "bg-amber-500", responding: "bg-sky-600", resolved: "bg-emerald-600", closed: "bg-slate-500" }[status] || "bg-slate-500");

export default function RecentAlertsTable() {
  const [alerts, setAlerts] = useState([]); const [error, setError] = useState("");
  useEffect(() => { getIncidents({ limit: 5 }).then((result) => setAlerts(result.data || [])).catch(() => setError("Alert feed is unavailable.")); }, []);
  return <div className="mt-8 rounded-xl bg-white p-5 shadow-lg"><h2 className="mb-1 text-2xl font-bold">Recent Safety Alerts</h2><p className="mb-4 text-sm text-slate-500">Live incidents are used as the operational alert queue.</p>{error ? <p className="text-sm text-rose-600">{error}</p> : alerts.length ? <div className="overflow-x-auto"><table className="w-full min-w-[580px]"><thead><tr className="bg-slate-100"><th className="p-3 text-left">Reference</th><th className="p-3 text-left">Tourist</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Location</th><th className="p-3 text-left">Status</th></tr></thead><tbody>{alerts.map((alert) => <tr key={alert._id} className="border-b hover:bg-slate-50"><td className="p-3 text-sm">{alert.reference}</td><td className="p-3">{alert.touristName || "—"}</td><td className="p-3 capitalize">{alert.type}</td><td className="p-3">{alert.locationLabel || "—"}</td><td className="p-3"><span className={`rounded-full px-3 py-1 text-xs font-medium text-white ${badge(alert.status)}`}>{alert.status}</span></td></tr>)}</tbody></table></div> : <p className="py-5 text-sm text-slate-500">No safety alerts have been recorded.</p>}</div>;
}

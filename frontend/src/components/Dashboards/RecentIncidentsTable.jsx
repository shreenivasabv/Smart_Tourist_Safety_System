import { useEffect, useState } from "react";
import { getIncidents } from "../../services/incidentService";

const badgeClass = (priority) => ({ critical: "bg-rose-600", high: "bg-orange-500", medium: "bg-amber-500", low: "bg-emerald-600" }[priority] || "bg-slate-500");

function RecentIncidentsTable() {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getIncidents({ limit: 5 })
      .then((result) => setIncidents(result.data || []))
      .catch(() => setError("Incident feed is unavailable."));
  }, []);

  return (
    <div className="mt-8 rounded-xl bg-white p-5 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Recent Area Incidents</h2>
      {error ? <p className="text-sm text-rose-600">{error}</p> : incidents.length ? <div className="overflow-x-auto"><table className="w-full min-w-[620px]"><thead><tr className="bg-gray-100"><th className="p-3 text-left">Reference</th><th className="p-3 text-left">Tourist</th><th className="p-3 text-left">Incident</th><th className="p-3 text-left">Location</th><th className="p-3 text-left">Priority</th><th className="p-3 text-left">Status</th></tr></thead><tbody>{incidents.map((item) => <tr key={item._id} className="border-b hover:bg-gray-50"><td className="p-3 text-sm">{item.reference}</td><td className="p-3">{item.touristName || "—"}</td><td className="p-3">{item.title}</td><td className="p-3">{item.locationLabel || "—"}</td><td className="p-3"><span className={`rounded-full px-3 py-1 text-white ${badgeClass(item.priority)}`}>{item.priority}</span></td><td className="p-3 capitalize">{item.status}</td></tr>)}</tbody></table></div> : <p className="py-4 text-sm text-slate-500">No incidents have been recorded.</p>}
    </div>
  );
}

export default RecentIncidentsTable;

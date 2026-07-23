import { useEffect, useMemo, useState } from "react";
import { FaCheck, FaExclamationTriangle, FaPlus, FaSave } from "react-icons/fa";
import { createIncident, getIncidentSummary, getIncidents, updateIncident } from "../../services/incidentService";
import { getAllTourists } from "../../services/touristService";

const initialForm = { tourist: "", type: "medical", priority: "high", title: "", description: "", locationLabel: "", reportedBy: "Control room" };
const labels = { open: "Open", acknowledged: "Acknowledged", responding: "Responding", resolved: "Resolved", closed: "Closed" };

function badgeClass(value) {
  return ({ critical: "bg-rose-100 text-rose-700", high: "bg-orange-100 text-orange-700", medium: "bg-amber-100 text-amber-700", low: "bg-emerald-100 text-emerald-700", open: "bg-rose-100 text-rose-700", acknowledged: "bg-amber-100 text-amber-700", responding: "bg-sky-100 text-sky-700", resolved: "bg-emerald-100 text-emerald-700", closed: "bg-slate-100 text-slate-700" })[value] || "bg-slate-100 text-slate-700";
}

function IncidentsWorkspace() {
  const [incidents, setIncidents] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [summary, setSummary] = useState({ open: 0, critical: 0, resolvedToday: 0 });
  const [form, setForm] = useState(initialForm);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const [incidentResult, summaryResult, touristResult] = await Promise.all([getIncidents(statusFilter ? { status: statusFilter } : undefined), getIncidentSummary(), getAllTourists()]);
      setIncidents(incidentResult.data || []);
      setSummary(summaryResult.data || initialForm);
      setTourists(touristResult.tourists || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load incident data.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const activeTourists = useMemo(() => tourists.filter((tourist) => tourist._id), [tourists]);
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true); setMessage("");
      await createIncident({ ...form, tourist: form.tourist || undefined });
      setForm(initialForm); setMessage("Incident recorded and ready for response.");
      await load();
    } catch (error) { setMessage(error.response?.data?.message || "Unable to create the incident."); }
    finally { setSaving(false); }
  };
  const changeStatus = async (incident, status) => {
    try { await updateIncident(incident._id, { status }); setMessage(`Incident ${labels[status].toLowerCase()}.`); await load(); }
    catch (error) { setMessage(error.response?.data?.message || "Unable to update incident status."); }
  };

  return <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-3">
      {[{ label: "Active cases", value: summary.open, tone: "text-sky-700" }, { label: "Critical active", value: summary.critical, tone: "text-rose-700" }, { label: "Resolved today", value: summary.resolvedToday, tone: "text-emerald-700" }].map((item) => <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{item.label}</p><p className={`mt-2 text-3xl font-semibold ${item.tone}`}>{item.value}</p></div>)}
    </div>

    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.6fr]">
      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-800"><FaPlus className="text-sky-600" /><h3 className="font-semibold">Log an incident</h3></div>
        <p className="mt-1 text-sm text-slate-500">Adding an incident never changes tourist or location records.</p>
        <div className="mt-5 space-y-3">
          <select value={form.tourist} onChange={(e) => setForm({ ...form, tourist: e.target.value })} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm"><option value="">No tourist linked</option>{activeTourists.map((tourist) => <option key={tourist._id} value={tourist._id}>{tourist.fullName}</option>)}</select>
          <div className="grid grid-cols-2 gap-3"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border border-slate-300 p-2.5 text-sm">{["medical", "missing", "security", "lost", "accident", "other"].map((type) => <option key={type}>{type}</option>)}</select><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-lg border border-slate-300 p-2.5 text-sm">{["low", "medium", "high", "critical"].map((priority) => <option key={priority}>{priority}</option>)}</select></div>
          <input required maxLength="140" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Incident title" className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
          <input value={form.locationLabel} onChange={(e) => setForm({ ...form, locationLabel: e.target.value })} placeholder="Location or landmark" className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What happened?" rows="3" className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
          <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"><FaSave />{saving ? "Recording…" : "Create incident"}</button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold text-slate-800">Response queue</h3><p className="text-sm text-slate-500">Track acknowledgement through closure.</p></div><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-300 p-2 text-sm"><option value="">All statuses</option>{Object.entries(labels).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></div>
        {message && <div className="mx-5 mt-4 rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-700">{message}</div>}
        <div className="divide-y divide-slate-100">{loading ? <p className="p-6 text-sm text-slate-500">Loading incidents…</p> : incidents.length ? incidents.map((incident) => <article key={incident._id} className="p-5"><div className="flex flex-col gap-3 sm:flex-row sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold text-slate-800">{incident.title}</h4><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass(incident.priority)}`}>{incident.priority}</span><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass(incident.status)}`}>{labels[incident.status]}</span></div><p className="mt-1 text-sm text-slate-600">{incident.touristName || "Unlinked incident"}{incident.locationLabel ? ` · ${incident.locationLabel}` : ""}</p><p className="mt-1 text-xs text-slate-400">{incident.reference} · {new Date(incident.createdAt).toLocaleString()}</p>{incident.description && <p className="mt-2 text-sm text-slate-600">{incident.description}</p>}</div><div className="flex shrink-0 items-start gap-2">{incident.status === "open" && <button onClick={() => changeStatus(incident, "acknowledged")} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-medium text-amber-700">Acknowledge</button>}{!["responding", "resolved", "closed"].includes(incident.status) && <button onClick={() => changeStatus(incident, "responding")} className="rounded-lg border border-sky-200 px-3 py-2 text-xs font-medium text-sky-700">Respond</button>}{!["resolved", "closed"].includes(incident.status) && <button onClick={() => changeStatus(incident, "resolved")} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white"><FaCheck />Resolve</button>}</div></div></article>) : <div className="p-10 text-center text-sm text-slate-500"><FaExclamationTriangle className="mx-auto mb-3 text-xl text-slate-300" />No incidents match this filter.</div>}</div>
      </div>
    </div>
  </div>;
}

export default IncidentsWorkspace;

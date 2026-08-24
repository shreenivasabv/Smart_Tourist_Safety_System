import React, { useCallback, useEffect, useState } from "react";
import { FaChartLine, FaExclamationTriangle, FaSyncAlt, FaUsers } from "react-icons/fa";
import { getOperationsSnapshot } from "../../services/operationsService";

const riskStyles = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-rose-500",
};

function Metric({ icon, label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">{icon}{label}</div>
      <p className="mt-3 text-3xl font-semibold text-slate-800">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSnapshot(await getOperationsSnapshot());
    } catch {
      setError("Live safety data could not be loaded. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="py-10 text-center text-sm text-slate-500">Loading live safety metrics…</p>;
  if (error) return <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}<button onClick={load} className="ml-3 underline">Try again</button></div>;

  const { stats, incidents } = snapshot;
  const activeIncidents = incidents.filter(({ status }) => !["resolved", "closed"].includes(status)).length;
  const totalRisk = Object.values(stats.riskLevel).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Updated {new Date(stats.generatedAt).toLocaleString()}</p>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><FaSyncAlt /> Refresh</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<FaUsers />} label="Registered tourists" value={stats.totalTourists} hint={`${stats.activeTourists} currently online`} />
        <Metric icon={<FaExclamationTriangle />} label="Outside safe zone" value={stats.outsideSafeZone} hint="Requires location review" />
        <Metric icon={<FaChartLine />} label="Active incidents" value={activeIncidents} hint={`${incidents.length} total incidents logged`} />
        <Metric icon={<FaChartLine />} label="Active geofences" value={stats.geoFenceRulesPlanned} hint={`${stats.sensitiveRouteSegments} sensitive areas`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800">Risk-level distribution</h3>
          <p className="mt-1 text-sm text-slate-500">Current assessment across registered tourists.</p>
          <div className="mt-6 space-y-4">
            {Object.entries(stats.riskLevel).map(([level, count]) => {
              const share = totalRisk ? Math.round((count / totalRisk) * 100) : 0;
              return <div key={level}><div className="mb-1 flex justify-between text-sm"><span className="capitalize text-slate-600">{level}</span><span className="font-medium text-slate-800">{count} ({share}%)</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${riskStyles[level]}`} style={{ width: `${share}%` }} /></div></div>;
            })}
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800">Operational attention</h3>
          <p className="mt-1 text-sm text-slate-500">Priorities calculated from the latest available records.</p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-lg bg-rose-50 p-3 text-rose-800"><strong>{stats.riskLevel.high}</strong> tourists are marked high risk.</div>
            <div className="rounded-lg bg-amber-50 p-3 text-amber-800"><strong>{stats.outsideSafeZone}</strong> tourists are outside the protected boundary.</div>
            <div className="rounded-lg bg-sky-50 p-3 text-sky-800"><strong>{activeIncidents}</strong> incidents still need resolution.</div>
          </div>
        </section>
      </div>
    </div>
  );
}

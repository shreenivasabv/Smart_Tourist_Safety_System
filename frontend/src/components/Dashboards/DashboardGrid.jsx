import { useCallback, useEffect, useState } from "react";
import { FaBell, FaExclamationTriangle, FaSearchLocation, FaShieldAlt, FaSyncAlt, FaUserCheck, FaUserSecret, FaUsers } from "react-icons/fa";
import DashboardCard from "./DashboardCard";
import { getOperationsSnapshot } from "../../services/operationsService";

function DashboardGrid() {
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => { try { setError(""); setSnapshot(await getOperationsSnapshot()); } catch { setError("Live dashboard data is unavailable."); } }, []);
  useEffect(() => { load(); }, [load]);
  if (!snapshot) return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">{error || "Loading live dashboard…"}</div>;
  const { stats, incidents } = snapshot;
  const active = incidents.filter((item) => !["resolved", "closed"].includes(item.status));
  const cards = [
    { title: "Registered tourists", value: stats.totalTourists, description: "All visitor registrations", Icon: FaUsers, color: "border-blue-500" },
    { title: "Active visitors", value: stats.activeTourists, description: "Location received within 5 minutes", Icon: FaUserCheck, color: "border-emerald-500" },
    { title: "Inside protected zones", value: stats.insideSafeZone, description: `${stats.outsideSafeZone} outside safe zone`, Icon: FaShieldAlt, color: "border-cyan-500" },
    { title: "Open safety alerts", value: active.length, description: "Incidents awaiting closure", Icon: FaBell, color: "border-rose-500" },
    { title: "High-risk visitors", value: stats.riskLevel.high, description: "Requires follow-up", Icon: FaUserSecret, color: "border-amber-500" },
    { title: "Critical incidents", value: active.filter((item) => item.priority === "critical").length, description: "Escalate immediately", Icon: FaExclamationTriangle, color: "border-orange-500" },
    { title: "Risk signals", value: stats.riskLevel.medium + stats.riskLevel.high, description: "Medium and high assessments", Icon: FaSearchLocation, color: "border-purple-500" },
    { title: "Active geofences", value: stats.geoFenceRulesPlanned, description: `${stats.sensitiveRouteSegments} sensitive zones`, Icon: FaShieldAlt, color: "border-indigo-500" },
  ];
  return <section><div className="mb-3 flex justify-end"><button onClick={load} className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800"><FaSyncAlt /> Refresh live data</button></div><div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">{cards.map(({ Icon, ...card }) => <DashboardCard key={card.title} {...card} icon={<Icon />} />)}</div></section>;
}

export default DashboardGrid;

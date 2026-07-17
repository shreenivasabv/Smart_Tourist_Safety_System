import React from "react";
import { FaShieldAlt, FaHospitalAlt, FaChartLine, FaFileAlt, FaCog, FaUserFriends, FaExclamationTriangle } from "react-icons/fa";
import Header from "../components/Dashboards/Header";
import DashboardGrid from "../components/Dashboards/DashboardGrid";
import RecentAlertsTable from "../components/Dashboards/RecentAlertsTable";
import RecentIncidentsTable from "../components/Dashboards/RecentIncidentsTable";
import PageShell from "../components/common/PageShell";
import TouristsPage from "../layouts/Tourists/TouristsPage";
import MonitoringPage from "../layouts/Monitoring/MonitoringPage";
import { DEPLOYMENT_AREA } from "../constants";

function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <Header />
      <DashboardGrid />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentAlertsTable />
        <RecentIncidentsTable />
      </div>
    </div>
  );
}

function IncidentsPage() {
  return (
    <PageShell title="Incident Response" subtitle="Manage open incidents, escalation, and emergency follow-ups.">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Open cases", value: "12" },
          { title: "Critical", value: "3" },
          { title: "Resolved today", value: "8" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{item.title}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        Latest escalation: Medical emergency near the Lake View Trail requires hospital coordination.
      </div>
    </PageShell>
  );
}

function PolicePage() {
  return (
    <PageShell title="Police Coordination" subtitle={`Track patrol units and dispatches covering ${DEPLOYMENT_AREA}.`}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <FaShieldAlt />
            <span className="font-semibold">Patrol assignments</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Unit 12 covering the North Entry Gate and visitor parking zone</li>
            <li>• Unit 07 monitoring the Lake View Trail and heritage walkway</li>
            <li>• Unit 02 supporting hospital transfer</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <FaExclamationTriangle />
            <span className="font-semibold">Priority dispatch</span>
          </div>
          <p className="text-sm text-slate-600">Two urgent requests are pending approval from district police control.</p>
        </div>
      </div>
    </PageShell>
  );
}

function HospitalsPage() {
  return (
    <PageShell title="Hospital Network" subtitle="Monitor emergency facilities, bed availability, and ambulance coordination.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <FaHospitalAlt />
            <span className="font-semibold">Nearby hospitals</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• City General Hospital — 4 beds available</li>
            <li>• Coastal Care Clinic — ambulance on standby</li>
            <li>• Heritage Emergency Center — trauma unit active</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Response SLA</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">6 min</p>
          <p className="mt-1 text-sm text-slate-500">Average ambulance response time in high-risk zones.</p>
        </div>
      </div>
    </PageShell>
  );
}

function AnalyticsPage() {
  return (
    <PageShell title="Analytics" subtitle="Review pilot-area trends, incident patterns, and future AI scoring readiness.">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Safety score", value: "91%" },
          { title: "Risk parameters tracked", value: "2" },
          { title: "Average response", value: "8 min" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-slate-700">
              <FaChartLine />
              <span className="font-semibold">{item.title}</span>
            </div>
            <p className="text-2xl font-semibold text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function ReportsPage() {
  return (
    <PageShell title="Reports" subtitle={`Generate and review registration, zone, and response reports for ${DEPLOYMENT_AREA}.`}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <FaFileAlt />
            <span className="font-semibold">Scheduled reports</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Daily pilot-area safety summary</li>
            <li>• Weekly incident and marker review</li>
            <li>• Monthly visitor and risk-parameter analytics</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Export status</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">Ready</p>
          <p className="mt-1 text-sm text-slate-500">All requested documents are prepared for download.</p>
        </div>
      </div>
    </PageShell>
  );
}

function SettingsPage() {
  return (
    <PageShell title="System Settings" subtitle="Adjust preferences, notifications, access controls, and rollout readiness.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <FaCog />
            <span className="font-semibold">Preferences</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Auto-alert threshold: High</li>
            <li>• Marker sync readiness: Planned</li>
            <li>• Mobile onboarding notifications: On</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <FaUserFriends />
            <span className="font-semibold">Team access</span>
          </div>
          <p className="text-sm text-slate-600">Admin, Police, and Hospital modules are currently enabled for the active operator.</p>
        </div>
      </div>
    </PageShell>
  );
}

export {
  DashboardHomePage,
  TouristsPage,
  MonitoringPage,
  IncidentsPage,
  PolicePage,
  HospitalsPage,
  AnalyticsPage,
  ReportsPage,
  SettingsPage,
};

export default DashboardHomePage;

import React, { useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaShieldAlt, FaHospitalAlt, FaChartLine, FaFileAlt, FaCog, FaUserFriends, FaExclamationTriangle, FaUserPlus } from "react-icons/fa";
import Header from "../components/layouts/Dashboards/Header";
import DashboardGrid from "../components/layouts/Dashboards/DashboardGrid";
import RecentAlertsTable from "../components/layouts/Dashboards/RecentAlertsTable";
import RecentIncidentsTable from "../components/layouts/Dashboards/RecentIncidentsTable";

const DEPLOYMENT_AREA = "Pilot Tourist Safety Zone";

function PageShell({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

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

function TouristsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    emergencyContact: "",
    deploymentArea: DEPLOYMENT_AREA,
    localStay: "",
    visitPurpose: "",
    arrivalDate: "",
    trackingConsent: "yes",
  });
  const [message, setMessage] = useState("");
  const [registrations, setRegistrations] = useState([]);

  const tourists = [
    { name: "Ava Johnson", zone: "North Entry Gate", status: "Safe", phone: "+91 98765 43210" },
    { name: "Liam Patel", zone: "Lake View Trail", status: "Monitoring", phone: "+91 99887 66554" },
    { name: "Sofia Rao", zone: "Temple Corridor", status: "Support Needed", phone: "+91 98712 34567" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/register", form);
      setRegistrations((prev) => [response.data.data, ...prev]);
      setMessage(`Registered successfully. Blockchain hash: ${response.data.data.blockchainHash.slice(0, 20)}...`);
      setForm({
        name: "",
        email: "",
        phone: "",
        country: "",
        emergencyContact: "",
        deploymentArea: DEPLOYMENT_AREA,
        localStay: "",
        visitPurpose: "",
        arrivalDate: "",
        trackingConsent: "yes",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <PageShell title="Pilot Area Tourist Management" subtitle={`Manage registrations, contact readiness, and zone coverage for ${DEPLOYMENT_AREA}.`}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">Registered in pilot area</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-900">126</p>
        </div>
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm text-sky-700">Tracking-ready visitors</p>
          <p className="mt-2 text-2xl font-semibold text-sky-900">84%</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm text-amber-700">Awaiting zone assignment</p>
          <p className="mt-2 text-2xl font-semibold text-amber-900">7</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-700">
          <FaUserPlus />
          <span className="font-semibold">Register Tourist for Single-Area Pilot</span>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          This form is prepared for a single protected tourism area and captures the details needed for future geo-fencing, mobile tracking, and AI-based risk prediction.
        </p>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Country / State" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} />
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Emergency contact" value={form.emergencyContact} onChange={(event) => setForm({ ...form, emergencyContact: event.target.value })} />
          <input className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-600" value={form.deploymentArea} readOnly />
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Hotel / stay location inside area" value={form.localStay} onChange={(event) => setForm({ ...form, localStay: event.target.value })} />
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Visit purpose" value={form.visitPurpose} onChange={(event) => setForm({ ...form, visitPurpose: event.target.value })} />
          <input className="rounded-lg border border-slate-300 px-3 py-2" type="date" value={form.arrivalDate} onChange={(event) => setForm({ ...form, arrivalDate: event.target.value })} />
          <select className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2" value={form.trackingConsent} onChange={(event) => setForm({ ...form, trackingConsent: event.target.value })}>
            <option value="yes">Mobile tracking consent provided</option>
            <option value="pending">Consent pending at check-in</option>
            <option value="no">Consent not provided</option>
          </select>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700">Register for Pilot Area</button>
          </div>
        </form>
        {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
      </div>

      {registrations.length ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <div className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Recent pilot registrations</div>
          <ul className="divide-y divide-slate-200">
            {registrations.map((item) => (
              <li key={item.id} className="px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-800">{item.name}</span> — {item.deploymentArea} — {item.trackingConsent} — {item.blockchainHash.slice(0, 24)}...
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Tourist</th>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Contact</th>
            </tr>
          </thead>
          <tbody>
            {tourists.map((tourist) => (
              <tr key={tourist.name} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-700">{tourist.name}</td>
                <td className="px-4 py-3">{tourist.zone}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tourist.status === "Support Needed" ? "bg-rose-100 text-rose-700" : tourist.status === "Monitoring" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {tourist.status}
                  </span>
                </td>
                <td className="px-4 py-3">{tourist.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

function MonitoringPage() {
  return (
    <PageShell title="Area Monitoring" subtitle={`Watch movement, marker planning, and future geo-fence readiness inside ${DEPLOYMENT_AREA}.`}>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center gap-2 text-slate-700">
            <FaMapMarkerAlt />
            <span className="font-semibold">Marker planning map</span>
          </div>
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
            Placeholder for checkpoints, geo-fence boundaries, and mobile tracking markers
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Planned marker points", value: "18" },
            { label: "Sensitive route segments", value: "4" },
            { label: "Geo-fence rules planned", value: "3" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { title: "Phase 1", detail: "Single-area registration and control dashboard" },
          { title: "Phase 2", detail: "Map markers, geo-fence boundaries, and mobile app onboarding" },
          { title: "Phase 3", detail: "AI prediction using movement, alerts, and zone risk parameters" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">{item.title}</p>
            <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
          </div>
        ))}
      </div>
    </PageShell>
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

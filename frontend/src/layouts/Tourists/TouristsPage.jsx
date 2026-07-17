import { useState } from "react";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import PageShell from "../../components/common/PageShell";
import { DEPLOYMENT_AREA } from "../../constants";

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

export default TouristsPage;

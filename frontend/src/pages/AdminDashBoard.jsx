import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "../components/layouts/Sidebar";
import TopNavbar from "../components/layouts/TopNavbar";
import {
  DashboardHomePage,
  MonitoringPage,
  IncidentsPage,
  PolicePage,
  HospitalsPage,
  AnalyticsPage,
  ReportsPage,
  SettingsPage,
} from "./FeaturePages";



import TouristDashboard from "../components/Tourists/TouristDashboard";
function AdminDashboard() {
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\//, "") || "dashboard";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar currentPath={currentPath} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <TopNavbar />

          <div className="mt-6">
            <Routes>
              <Route path="/" element={<DashboardHomePage />} />
              <Route path="/tourists" element={<TouristDashboard />} />
              <Route path="/monitoring" element={<MonitoringPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/police" element={<PolicePage />} />
              <Route path="/hospitals" element={<HospitalsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

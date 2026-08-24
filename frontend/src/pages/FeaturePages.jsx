import React from "react";
import Header from "../components/Dashboards/Header";
import DashboardGrid from "../components/Dashboards/DashboardGrid";
import RecentAlertsTable from "../components/Dashboards/RecentAlertsTable";
import RecentIncidentsTable from "../components/Dashboards/RecentIncidentsTable";
import PageShell from "../components/common/PageShell";
import TouristsPage from "../layouts/Tourists/TouristsPage";
import MonitoringPage from "../layouts/Monitoring/MonitoringPage";
import { DEPLOYMENT_AREA } from "../constants";
import IncidentsWorkspace from "../components/Incidents/IncidentsWorkspace";
import AnalyticsDashboard from "../components/Operations/AnalyticsDashboard";
import ReportsDashboard from "../components/Operations/ReportsDashboard";
import ResponseUnitDirectory from "../components/Operations/ResponseUnitDirectory";
import SystemSettings from "../components/Operations/SystemSettings";

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
    <PageShell title="Incident Response" subtitle="Create, prioritize, acknowledge, and resolve live safety incidents.">
      <IncidentsWorkspace />
    </PageShell>
  );
}

function PolicePage() {
  return (
    <PageShell title="Police Coordination" subtitle={`Maintain patrol availability and dispatch coverage for ${DEPLOYMENT_AREA}.`}>
      <ResponseUnitDirectory type="police" />
    </PageShell>
  );
}

function HospitalsPage() {
  return (
    <PageShell title="Hospital Network" subtitle="Maintain emergency facilities, available beds, and contact coverage.">
      <ResponseUnitDirectory type="hospital" />
    </PageShell>
  );
}

function AnalyticsPage() {
  return (
    <PageShell title="Analytics" subtitle="Live safety metrics and operational priorities from the current platform data.">
      <AnalyticsDashboard />
    </PageShell>
  );
}

function ReportsPage() {
  return (
    <PageShell title="Reports" subtitle={`Download current registration, response, and safety data for ${DEPLOYMENT_AREA}.`}>
      <ReportsDashboard />
    </PageShell>
  );
}

function SettingsPage() {
  return (
    <PageShell title="System Settings" subtitle="Review alert readiness and save dashboard preferences for this operator.">
      <SystemSettings />
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

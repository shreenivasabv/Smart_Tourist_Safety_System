import API from "./apiClient";

export const getDashboardSummary = async () => {

  return await API.get("/dashboard/summary");

};

export const getRecentAlerts = async () => {

  return await API.get("/dashboard/alerts");

};

export const getRecentIncidents = async () => {

  return await API.get("/dashboard/incidents");

};

export const getAnalytics = async () => {

  return await API.get("/dashboard/analytics");

};

export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getMonitoringStats = async () => {
  const response = await API.get("/dashboard/stats");
  return response.data;
};

export const getLiveTourists = async () => {
  const response = await API.get("/dashboard/tourists-live");
  return response.data;
};

export const getZones = async () => {
  const response = await API.get("/zones?active=true");
  return response.data;
};

export default API;

import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const getIncidents = async (params) => (await API.get("/incidents", { params })).data;
export const getIncidentSummary = async () => (await API.get("/incidents/summary")).data;
export const createIncident = async (payload) => (await API.post("/incidents", payload)).data;
export const updateIncident = async (id, payload) => (await API.patch(`/incidents/${id}`, payload)).data;

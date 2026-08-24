import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/response-units" });
export const getResponseUnits = async (type) => (await API.get("/", { params: type ? { type } : undefined })).data;
export const createResponseUnit = async (payload) => (await API.post("/", payload)).data;
export const updateResponseUnit = async (id, payload) => (await API.patch(`/${id}`, payload)).data;
export const deleteResponseUnit = async (id) => (await API.delete(`/${id}`)).data;

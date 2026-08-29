import API from "./apiClient";

const BASE_PATH = "/response-units";
export const getResponseUnits = async (type) => (await API.get(BASE_PATH, { params: type ? { type } : undefined })).data;
export const createResponseUnit = async (payload) => (await API.post(BASE_PATH, payload)).data;
export const updateResponseUnit = async (id, payload) => (await API.patch(`${BASE_PATH}/${id}`, payload)).data;
export const deleteResponseUnit = async (id) => (await API.delete(`${BASE_PATH}/${id}`)).data;

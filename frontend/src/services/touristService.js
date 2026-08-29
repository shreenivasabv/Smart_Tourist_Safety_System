import API from "./apiClient";

const BASE_PATH = "/tourists";


export const registerTourist = async (touristData) => {
    const response = await API.post(BASE_PATH, touristData);
    return response.data;
};

export const getAllTourists = async () => {
    const response = await API.get(BASE_PATH);
    return response.data;
};

export const getTouristById = async (id) => {
    const response = await API.get(`${BASE_PATH}/${id}`);
    return response.data;
};

export const updateTourist = async (id, updatedData) => {
    const response = await API.put(`${BASE_PATH}/${id}`, updatedData);
    return response.data;
};

export const deleteTourist = async (id) => {
    const response = await API.delete(`${BASE_PATH}/${id}`);
    return response.data;
};


export const getDashboardStats = async () => {
    const response = await API.get("/tourist-dashboard");
    return response.data;
};

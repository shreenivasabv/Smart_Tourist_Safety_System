import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/tourists",      
});


export const registerTourist = async (touristData) => {
    const response = await API.post("/", touristData);
    return response.data;
};

export const getAllTourists = async () => {
    const response = await API.get("/");
    return response.data;
};

export const getTouristById = async (id) => {
    const response = await API.get(`/${id}`);
    return response.data;
};

export const updateTourist = async (id, updatedData) => {
    const response = await API.put(`/${id}`, updatedData);
    return response.data;
};

export const deleteTourist = async (id) => {
    const response = await API.delete(`/${id}`);
    return response.data;
};


export const getDashboardStats = async () => {
    const response = await API.get("/dashboard");
    return response.data;
};

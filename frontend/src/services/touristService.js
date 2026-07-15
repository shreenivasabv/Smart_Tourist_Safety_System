import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/tourists",      
});


export const registerTourist = async (touristData) => {
    try {
        const response = await API.post("/", touristData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllTourists = async () => {
    try {
        const response = await API.get("/");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTouristById = async (id) => {
    try {   
        const response = await API.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTourist = async (id, updatedData) => {
    try {       
        const response = await API.put(`/${id}`, updatedData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTourist = async (id) => {
    try {
        const response = await API.delete(`/${id}`);        
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getDashboardStats = async () => {
    try {
        const response = await API.get("/dashboard");
        return response.data;   
    } catch (error) {
        throw error;
    }
};
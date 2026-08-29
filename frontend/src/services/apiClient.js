import axios from "axios";

const redirectToLogin = () => {
  localStorage.removeItem("token");
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

const attachAuthorization = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleUnauthorized = (error) => {
  if (error.response?.status === 401) {
    redirectToLogin();
  }
  return Promise.reject(error);
};

// Covers direct `axios` calls in the login/password pages after this module is
// loaded by main.jsx. Axios instances register the same interceptors below.
axios.interceptors.request.use(attachAuthorization);
axios.interceptors.response.use((response) => response, handleUnauthorized);

const apiClient = axios.create({ baseURL: "http://localhost:5000/api" });
apiClient.interceptors.request.use(attachAuthorization);
apiClient.interceptors.response.use((response) => response, handleUnauthorized);

export default apiClient;

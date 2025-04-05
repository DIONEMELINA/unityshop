import axios from "axios";

const API_URL = "https://rrn24.techchantier.com/buy_together/public/";

const token = localStorage.getItem("authToken");
const api = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: token ? `Bearer ${token.trim()}` : "",
        "Content-Type": "application/json",  // Use JSON for GET requests
        "Accept": "application/json",
    }
});

// Interceptor to set Authorization header dynamically before every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken"); // Always fetch latest token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;





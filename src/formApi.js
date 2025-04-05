
import axios from "axios";

const API_URL = "https://rrn24.techchantier.com/buy_together/public/";

const token = localStorage.getItem("authToken");
const formApi = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: token ? `Bearer ${token.trim()}` : "",
        "Content-Type": "multipart/form-data", 
        "Accept": "application/json",
    }
});


formApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken"); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default formApi;
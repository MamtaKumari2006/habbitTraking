import axios from "axios";

const API = axios.create({
    // Yahan apna Render wala link dalo aur end me /api lagao ✅
    baseURL: "https://APNA-RENDER-BACKEND-URL.onrender.com/api",
});

// Automatic token attach karne ke liye (taaki baar baar header na likhna pade)
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
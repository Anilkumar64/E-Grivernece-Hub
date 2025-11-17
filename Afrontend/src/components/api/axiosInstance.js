import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4400/api", // your backend URL
    withCredentials: true,
});

export default api;

import axios from "axios"

const ApiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api",
    timeout: 8000,
})

export default ApiInstance;

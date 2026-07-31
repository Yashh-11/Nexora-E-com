import axios from "axios"

const ApiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://nexora-e-kr6n19bo-yash-s-projects-e0b1ca75.vercel.app/api",
    timeout: 8000,
})

export default ApiInstance;

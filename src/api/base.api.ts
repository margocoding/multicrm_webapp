import { create } from "axios";

export const baseApi = create({
    baseURL: import.meta.env.VITE_API_URL
})
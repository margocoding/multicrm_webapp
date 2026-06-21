import { baseApi } from "./base.api";

export interface ActivityLog {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: string;
}

export const logsApi = {
  async getAll(): Promise<ActivityLog[]> {
    const { data } = await baseApi.get("/logs");
    return data;
  },
};
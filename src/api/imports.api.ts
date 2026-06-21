import { baseApi } from "./base.api";

export interface ImportBatch {
  id: string;
  name: string;
  type: "xml" | "json";
  status: "processing" | "completed" | "failed";
  productsCount: number;
  targetSiteIds: string[];
  createdAt: string;
}

export interface ImportAnalysis {
  productsCount: number;
  categories: string[];
}

export const importsApi = {
  async getAll(): Promise<ImportBatch[]> {
    const { data } = await baseApi.get("/imports");
    return data;
  },

  async analyze(file: File): Promise<ImportAnalysis> {
    const formData = new FormData();
    formData.append("file", file);
    
    const { data } = await baseApi.post("/imports/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async create(file: File, targetSiteIds: string[]): Promise<ImportBatch> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetSiteIds", JSON.stringify(targetSiteIds));
    
    const { data } = await baseApi.post("/imports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async remove(id: string): Promise<void> {
    await baseApi.delete(`/imports/${id}`);
  },
};
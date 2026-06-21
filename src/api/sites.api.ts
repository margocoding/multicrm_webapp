import type { Site } from "../types";
import { baseApi } from "./base.api";

export interface CreateSiteDto {
  name: string;
  domain: string;
  type: 'product' | 'article';
}

export interface UpdateSiteDto {
  name?: string;
  domain?: string;
  type?: 'product' | 'article';
}

export interface GetSitesDto {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationResponse<T> {
  total: number;
  items: T[];
}

export const sitesApi = {
  async getAll(params: GetSitesDto = {}): Promise<PaginationResponse<Site>> {
    const { data } = await baseApi.get('/sites', { params });
    return data;
  },

  async create(dto: CreateSiteDto): Promise<Site> {
    const { data } = await baseApi.post('/sites', dto);
    return data;
  },

  async update(id: string, dto: UpdateSiteDto): Promise<Site> {
    const { data } = await baseApi.patch(`/sites/${id}`, dto);
    return data;
  },

  async remove(id: string): Promise<void> {
    await baseApi.delete(`/sites/${id}`);
  },
};
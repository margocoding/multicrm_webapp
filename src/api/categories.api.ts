import { baseApi } from "./base.api";

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  productsCount: number;
  children?: {
    id: string;
    name: string;
    productsCount: number;
  }[];
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  parentId?: string | null;
}

export interface UpdateCategoryDto {
  name?: string;
  parentId?: string | null;
}

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data } = await baseApi.get("/categories");
    return data;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await baseApi.get(`/categories/${id}`);
    return data;
  },

  async create(dto: CreateCategoryDto): Promise<Category> {
    const { data } = await baseApi.post("/categories", dto);
    return data;
  },

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const { data } = await baseApi.patch(`/categories/${id}`, dto);
    return data;
  },

  async remove(id: string): Promise<void> {
    await baseApi.delete(`/categories/${id}`);
  },
};
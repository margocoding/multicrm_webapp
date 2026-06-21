import { baseApi } from "./base.api";

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  standard?: string;
  length?: string;
  weight?: string;
  price: string;
  priceUnit: string;
  status: "IN STOCK" | "OUT OF STOCK";
  image: string;
  type: "rail" | "component";
  categoryId?: string | null;
  publishedSitesCount: number;
  createdAt: string;
  quantity: number;
}

export interface PublishedSite {
  id: string;
  domain: string;
}

export interface ProductDetails extends Product {
  publishedSites?: PublishedSite[];
}

export interface CreateProductDto {
  name: string;
  subtitle?: string;
  standard?: string;
  length?: string;
  weight?: string;
  categoryId?: string | null;
  price: string;
  priceUnit: string;
  image?: File | null;
  siteIds?: string[];
  quantity: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {};

export interface GetProductsDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: "rail" | "component";
  status?: "IN STOCK" | "OUT OF STOCK";
}

export interface GetProductsByDomainDto {
  domain: string;
  page?: number;
  limit?: number;
  search?: string;
  type?: "rail" | "component";
  status?: "IN STOCK" | "OUT OF STOCK";
}

export interface PublishProductDto {
  productId: string;
  siteId: string;
  isPublished?: boolean;
}

export interface PaginationResponse<T> {
  total: number;
  items: T[];
}

export const productsApi = {
  async getAll(
    params: GetProductsDto = {},
  ): Promise<PaginationResponse<Product>> {
    const { data } = await baseApi.get("/products", { params });
    return data;
  },

  async getById(id: string): Promise<ProductDetails> {
    const { data } = await baseApi.get(`/products/${id}`);
    return data;
  },

  async getByDomain(
    dto: GetProductsByDomainDto,
  ): Promise<PaginationResponse<Product>> {
    const { domain, ...params } = dto;
    const { data } = await baseApi.post(
      "/products/by-domain",
      { domain },
      { params },
    );
    return data;
  },

  async create(dto: CreateProductDto): Promise<Product> {
    const formData = new FormData();

    Object.entries(dto).forEach(([key, value]) => {
      if (value != null) {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            formData.append(`${key}[]`, "");
          } else {
            value.forEach((v) => formData.append(`${key}[]`, v));
          }
        } else {
          formData.append(key, value as any);
        }
      }
    });

    const { data } = await baseApi.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const formData = new FormData();

    Object.entries(dto).forEach(([key, value]) => {
      if (value != null) {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            formData.append(`${key}[]`, "");
          } else {
            value.forEach((v) => formData.append(`${key}[]`, v));
          }
        } else {
          formData.append(key, value as any);
        }
      }
    });

    const { data } = await baseApi.patch(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async remove(id: string): Promise<void> {
    await baseApi.delete(`/products/${id}`);
  },

  async publishToSite(dto: PublishProductDto): Promise<void> {
    await baseApi.post("/products/publish", dto);
  },

  async unpublishFromSite(productId: string, siteId: string): Promise<void> {
    await baseApi.delete(`/products/unpublish`, {
      data: { productId, siteId },
    });
  },
};

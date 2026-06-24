import { baseApi } from "./base.api";

export type ProductCondition = "NEW" | "USED" | "REFURBISHED" | "RESERVED";

export interface Characteristic {
  id?: string;
  title: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  price: string;
  priceUnit: string;
  image: string | null;
  categoryId?: string | null;
  publishedSitesCount: number;
  createdAt: string;
  quantity: number;
  unit: string;
  condition: ProductCondition;
  characteristics: Characteristic[];
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
  subtitle?: string | null;
  categoryId?: string | null;
  price: string;
  priceUnit: string;
  image?: File | null;
  siteIds?: string[];
  quantity: number;
  unit?: string;
  condition?: ProductCondition;
  characteristics?: Characteristic[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface GetProductsDto {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export interface GetProductsByDomainDto {
  domain: string;
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
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

const appendFormValue = (formData: FormData, key: string, value: any) => {
  if (value == null) return;

  if (key === "characteristics" && Array.isArray(value)) {
    value.forEach((char: Characteristic, i: number) => {
      formData.append(`characteristics[${i}][title]`, char.title);
      formData.append(`characteristics[${i}][value]`, char.value);
    });
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      formData.append(`${key}[]`, "");
    } else {
      value.forEach((v) => formData.append(`${key}[]`, v as string));
    }
  } else {
    formData.append(key, value as any);
  }
};

const buildFormData = (dto: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.entries(dto).forEach(([key, value]) => {
    appendFormValue(formData, key, value);
  });
  return formData;
};

export const productsApi = {
  async getAll(
    params: GetProductsDto = {},
  ): Promise<PaginationResponse<Product>> {
    const { data } = await baseApi.get("/products", { params });
    return data;
  },

  async getBySlug(slug: string): Promise<ProductDetails> {
    const { data } = await baseApi.get(`/products/${slug}`);
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
    const formData = buildFormData(dto);

    const { data } = await baseApi.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async update(idOrSlug: string, dto: UpdateProductDto): Promise<Product> {
    const formData = buildFormData(dto);

    const { data } = await baseApi.patch(`/products/${idOrSlug}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async remove(idOrSlug: string): Promise<void> {
    await baseApi.delete(`/products/${idOrSlug}`);
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
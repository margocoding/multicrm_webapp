import { baseApi } from "./base.api";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  subtitle?: string | null;
  standard?: string | null;
  length?: string | null;
  weight?: string | null;
  image?: string | null;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  email: string;
  comment?: string | null;
  status: "NEW" | "PROCESSED" | "CANCELLED";
  totalPrice: string;
  currency: string;
  items: OrderItem[];
  createdAt: string;
}

export const ordersApi = {
  async getAll(): Promise<Order[]> {
    const { data } = await baseApi.get("/orders");
    return data;
  },

  async getById(id: string): Promise<Order> {
    const { data } = await baseApi.get(`/orders/${id}`);
    return data;
  },

  async updateStatus(
    id: string,
    status: "NEW" | "PROCESSED" | "CANCELLED",
  ): Promise<Order> {
    const { data } = await baseApi.patch(`/orders/${id}/status`, { status });
    return data;
  },

  async remove(id: string): Promise<void> {
    await baseApi.delete(`/orders/${id}`);
  },
};

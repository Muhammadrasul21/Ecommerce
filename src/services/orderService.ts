import type { Order } from "../types/type";

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
}

export const getOrders = async (
  page = 0,
  size = 10,
  sortBy = "orderDate",
  sortDir: "asc" | "desc" = "desc",
): Promise<PagedResponse<Order>> => {
  const url = `https://api-e-commerce.tenzorsoft.uz/orders?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};



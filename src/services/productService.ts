import type { ApiResponse, ProductsResponse } from "../types/type";

export const getProducts = async (): Promise<ProductsResponse> => {
  const response = await fetch(
    "https://api-e-commerce.tenzorsoft.uz/products?page=0&size=50&sortBy=id&sortDir=asc",
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`,
    );
  }

  const apiResponse: ApiResponse = await response.json();

  return apiResponse.data;
};
import type { Product } from "../types/type";

export const addProduct = async (product: Product): Promise<Product> => {
  const response = await fetch(
    "https://api-e-commerce.tenzorsoft.uz/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to add product: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  const response = await fetch(
    `https://api-e-commerce.tenzorsoft.uz/products/${product.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update product: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(
    `https://api-e-commerce.tenzorsoft.uz/products/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to delete product: ${response.status} ${response.statusText}`,
    );
  }
};

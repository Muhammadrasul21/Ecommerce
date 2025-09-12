import type { ProductsResponse } from "../types/type";

interface ApiResponse {
  success: boolean;
  message: string;
  data: ProductsResponse;
}

export const getProducts = async (): Promise<ProductsResponse> => {
  const response = await fetch(
    "https://api-e-commerce.tenzorsoft.uz/products?page=0&size=50&sortBy=id&sortDir=asc"
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`
    );
  }

  const apiResponse: ApiResponse = await response.json();
  
  // API'dan kelgan data strukturasini bizning ProductsResponse formatiga moslashtirish
  return apiResponse.data;
};

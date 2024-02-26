import { IProduct } from "@/models/IProduct";
import { makeRequest } from "./makeRequest";

export const getProductsByIds = async (ids: string[], signal?: AbortSignal): Promise<IProduct[]> => {
  const productsResponse = await makeRequest({
    action: "get_items",
    params: {
      ids: ids
    }
  }, signal);
  const products = productsResponse.data.result;
  const uniqueProducts = Array.from(new Map(products.map(product => [product['id'], product])).values());
  return uniqueProducts;
}
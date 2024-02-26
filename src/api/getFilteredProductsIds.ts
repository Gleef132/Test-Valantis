import { IBodyRequest } from "@/models/IBodyRequest";
import { makeRequest } from "./makeRequest";

export const getFilteredProductIds = async (requestBody: IBodyRequest, signal?: AbortSignal): Promise<string[]> => {
  const ids = await makeRequest(requestBody, signal);
  return ids.data.result;
}
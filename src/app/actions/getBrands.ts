'use server'

import { makeRequest } from "@/api/makeRequest";

export const getBrands = async (): Promise<string[]> => {

  try {
    const items = await makeRequest({
      action: "get_fields", params: {
        field: 'brand'
      }
    });
    const brands = items.data.result
    const uniqueBrands = Array.from(new Set(brands.filter(brand => brand))).sort((a, b) => a.localeCompare(b));
    return uniqueBrands;
  } catch (e) {
    console.log(e)
    return []
  }
}
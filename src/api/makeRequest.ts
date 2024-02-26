import { IBodyRequest } from "@/models/IBodyRequest";
import { createXAuth } from "@/utils/createXAuth";

interface ApiResponse {
  data: {
    result: any[];
  };
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export const makeRequest = async ({ action, params }: IBodyRequest, signal?: AbortSignal): Promise<ApiResponse> => {
  const headers = {
    'X-Auth': createXAuth(),
    'Content-Type': 'application/json'
  };
  let body = {};
  if (params) {
    body = { action, params }
  }
  else {
    body = { action }
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTS_API}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal
  });

  const data = await response.json();

  return {
    data: data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: {},
    request: {}
  };
};

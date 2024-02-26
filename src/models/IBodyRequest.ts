type fields = 'brand' | 'price' | 'product';

export type IBodyRequest = {
  action: 'get_items';
  params: {
    ids: string[];
  };
} | {
  action: 'get_ids';
  params?: {
    offset?: number;
    limit?: number;
  }
} | {
  action: 'get_fields',
  params?: {
    field?: fields;
    offset?: number;
    limit?: number;
  }
} | {
  action: 'filter',
  params: {
    brand?: string;
    price?: number;
    product?: string;
  }
}
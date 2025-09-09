// Real Estate Application Types

export interface Owner {
  id: number;
  name: string;
  address: string;
  photo?: string;
  birthday: string;
}

export interface Property {
  id: number;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: number;
  owner?: Owner;
  photo?: string;
}

export interface PropertyFilter {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  owner?: string;
}

export interface PropertySummary {
  totalProperties: number;
  totalValue: number;
  averagePrice: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

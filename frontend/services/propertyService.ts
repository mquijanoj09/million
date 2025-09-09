import {
  Property,
  PropertyFilter,
  PropertySummary,
  ApiResponse,
} from "../types";
import { ApiClient, config } from "../lib/api";

const apiClient = new ApiClient(config);

export const propertyService = {
  async getProperties(
    filter?: PropertyFilter
  ): Promise<ApiResponse<Property[]>> {
    const queryParams = new URLSearchParams();

    if (filter) {
      if (filter.name) queryParams.append("name", filter.name);
      if (filter.address) queryParams.append("address", filter.address);
      if (filter.minPrice)
        queryParams.append("minPrice", filter.minPrice.toString());
      if (filter.maxPrice)
        queryParams.append("maxPrice", filter.maxPrice.toString());
      if (filter.year) queryParams.append("year", filter.year.toString());
      if (filter.owner) queryParams.append("owner", filter.owner);
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/properties${queryString ? `?${queryString}` : ""}`;

    return await apiClient.get<ApiResponse<Property[]>>(endpoint);
  },

  async getPropertyById(id: string | number): Promise<ApiResponse<Property>> {
    return await apiClient.get<ApiResponse<Property>>(`/api/properties/${id}`);
  },

  async getPropertySummary(): Promise<ApiResponse<PropertySummary>> {
    return await apiClient.get<ApiResponse<PropertySummary>>(
      "/api/properties/summary"
    );
  },
};

// Backward compatibility exports
export const getProperties = propertyService.getProperties;
export const getPropertyById = propertyService.getPropertyById;
export const getPropertySummary = propertyService.getPropertySummary;

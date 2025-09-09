import {
  Property,
  Owner,
  PropertyFilter,
  PropertySummary,
  ApiResponse,
} from "../types";
import { ApiClient, config } from "../lib/api";

const apiClient = new ApiClient(config);

// Owner Service
export const ownerService = {
  async getAllOwners(): Promise<ApiResponse<Owner[]>> {
    return await apiClient.get<ApiResponse<Owner[]>>("/api/owners");
  },

  async getOwnerById(id: number): Promise<ApiResponse<Owner>> {
    return await apiClient.get<ApiResponse<Owner>>(`/api/owners/${id}`);
  },

  async createOwner(owner: Omit<Owner, "id">): Promise<ApiResponse<Owner>> {
    return await apiClient.post<ApiResponse<Owner>>("/api/owners", owner);
  },

  async updateOwner(
    id: number,
    owner: Omit<Owner, "id">
  ): Promise<ApiResponse<Owner>> {
    return await apiClient.put<ApiResponse<Owner>>(`/api/owners/${id}`, owner);
  },

  async deleteOwner(id: number): Promise<ApiResponse<any>> {
    return await apiClient.delete<ApiResponse<any>>(`/api/owners/${id}`);
  },

  async getOwnerProperties(id: number): Promise<ApiResponse<Property[]>> {
    return await apiClient.get<ApiResponse<Property[]>>(
      `/api/owners/${id}/properties`
    );
  },
};

// Property Service
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

  async getPropertyById(id: number): Promise<ApiResponse<Property>> {
    return await apiClient.get<ApiResponse<Property>>(`/api/properties/${id}`);
  },

  async createProperty(
    property: Omit<Property, "id" | "owner">
  ): Promise<ApiResponse<Property>> {
    return await apiClient.post<ApiResponse<Property>>(
      "/api/properties",
      property
    );
  },

  async updateProperty(
    id: number,
    property: Omit<Property, "id" | "owner">
  ): Promise<ApiResponse<Property>> {
    return await apiClient.put<ApiResponse<Property>>(
      `/api/properties/${id}`,
      property
    );
  },

  async deleteProperty(id: number): Promise<ApiResponse<any>> {
    return await apiClient.delete<ApiResponse<any>>(`/api/properties/${id}`);
  },

  async getPropertySummary(): Promise<ApiResponse<PropertySummary>> {
    return await apiClient.get<ApiResponse<PropertySummary>>(
      "/api/properties/summary"
    );
  },

  async addPropertyImage(
    id: number,
    imageUrl: string
  ): Promise<ApiResponse<Property>> {
    return await apiClient.post<ApiResponse<Property>>(
      `/api/properties/add-image/${id}`,
      { imageUrl }
    );
  },
};

// Backward compatibility - keeping the same function names as the mock service
export const getProperties = async (
  filter?: PropertyFilter
): Promise<ApiResponse<Property[]>> => {
  return await propertyService.getProperties(filter);
};

export const getPropertyById = async (
  id: number
): Promise<ApiResponse<Property>> => {
  return await propertyService.getPropertyById(id);
};

export const createProperty = async (
  property: Omit<Property, "id" | "owner">
): Promise<ApiResponse<Property>> => {
  return await propertyService.createProperty(property);
};

export const updateProperty = async (
  id: number,
  property: Omit<Property, "id" | "owner">
): Promise<ApiResponse<Property>> => {
  return await propertyService.updateProperty(id, property);
};

export const deleteProperty = async (id: number): Promise<ApiResponse<any>> => {
  return await propertyService.deleteProperty(id);
};

export const getOwners = async (): Promise<ApiResponse<Owner[]>> => {
  return await ownerService.getAllOwners();
};

export const getOwnerById = async (id: number): Promise<ApiResponse<Owner>> => {
  return await ownerService.getOwnerById(id);
};

export const createOwner = async (
  owner: Omit<Owner, "id">
): Promise<ApiResponse<Owner>> => {
  return await ownerService.createOwner(owner);
};

export const updateOwner = async (
  id: number,
  owner: Omit<Owner, "id">
): Promise<ApiResponse<Owner>> => {
  return await ownerService.updateOwner(id, owner);
};

export const deleteOwner = async (id: number): Promise<ApiResponse<any>> => {
  return await ownerService.deleteOwner(id);
};

export const getPropertySummary = async (): Promise<
  ApiResponse<PropertySummary>
> => {
  return await propertyService.getPropertySummary();
};

export const getOwnerProperties = async (
  ownerId: number
): Promise<ApiResponse<Property[]>> => {
  return await ownerService.getOwnerProperties(ownerId);
};

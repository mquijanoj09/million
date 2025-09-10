import { Owner, ApiResponse } from "../types";
import { ApiClient, config } from "../lib/api";

const apiClient = new ApiClient(config);

export const ownerService = {
  async getAllOwners(): Promise<ApiResponse<Owner[]>> {
    return await apiClient.get<ApiResponse<Owner[]>>("/api/owners");
  },
};

// Backward compatibility exports
export const getOwners = ownerService.getAllOwners;

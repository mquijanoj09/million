import {
  Property,
  Owner,
  PropertyFilter,
  PropertySummary,
  ApiResponse,
  PaginationParams,
} from "../types";

// Mock data for development
const mockOwners: Owner[] = [
  {
    id: 1,
    name: "John Smith",
    address: "123 Main St, City",
    birthday: "1975-05-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    address: "456 Oak Ave, Town",
    birthday: "1982-09-20",
  },
  {
    id: 3,
    name: "Michael Brown",
    address: "789 Pine Rd, Village",
    birthday: "1968-12-03",
  },
  {
    id: 4,
    name: "Emily Davis",
    address: "321 Elm St, District",
    birthday: "1990-07-18",
  },
];

const mockProperties: Property[] = [
  {
    id: 1,
    name: "Luxury Downtown Condo",
    address: "500 5th Avenue, New York, NY",
    price: 1250000,
    codeInternal: "NYC001",
    year: 2020,
    idOwner: 1,
    owner: mockOwners[0],
    photo:
      "https://cdn.millionluxury.com/image-resizing?image=https://azfd-prod.millionluxury.com/mls/389726469_1.jpg&width=1170",
  },
  {
    id: 2,
    name: "Suburban Family Home",
    address: "123 Maple Drive, Austin, TX",
    price: 450000,
    codeInternal: "AUS002",
    year: 2018,
    idOwner: 2,
    owner: mockOwners[1],
  },
  {
    id: 3,
    name: "Modern Beach House",
    address: "789 Ocean View, Miami, FL",
    price: 850000,
    codeInternal: "MIA003",
    year: 2021,
    idOwner: 3,
    owner: mockOwners[2],
  },
  {
    id: 4,
    name: "Historic Townhouse",
    address: "456 Heritage Lane, Boston, MA",
    price: 675000,
    codeInternal: "BOS004",
    year: 1995,
    idOwner: 4,
    owner: mockOwners[3],
  },
  {
    id: 5,
    name: "Mountain Cabin Retreat",
    address: "101 Pine Summit, Denver, CO",
    price: 320000,
    codeInternal: "DEN005",
    year: 2015,
    idOwner: 1,
    owner: mockOwners[0],
  },
  {
    id: 6,
    name: "Urban Loft",
    address: "200 Industrial Way, Portland, OR",
    price: 580000,
    codeInternal: "POR006",
    year: 2019,
    idOwner: 2,
    owner: mockOwners[1],
  },
  {
    id: 7,
    name: "Waterfront Villa",
    address: "888 Seaside Blvd, San Diego, CA",
    price: 1800000,
    codeInternal: "SD007",
    year: 2022,
    idOwner: 3,
    owner: mockOwners[2],
  },
  {
    id: 8,
    name: "Cozy Studio Apartment",
    address: "999 Downtown Ave, Chicago, IL",
    price: 275000,
    codeInternal: "CHI008",
    year: 2017,
    idOwner: 4,
    owner: mockOwners[3],
  },
];

export class PropertyService {
  async getProperties(
    filters?: PropertyFilter,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Property[]>> {
    try {
      // In a real app, this would make an API call to the backend
      // const response = await apiClient.get<Property[]>('/api/properties', { params: { ...filters, ...pagination } });

      // Mock implementation with filtering
      let filteredProperties = [...mockProperties];

      if (filters) {
        if (filters.name) {
          filteredProperties = filteredProperties.filter((p) =>
            p.name.toLowerCase().includes(filters.name!.toLowerCase())
          );
        }
        if (filters.address) {
          filteredProperties = filteredProperties.filter((p) =>
            p.address.toLowerCase().includes(filters.address!.toLowerCase())
          );
        }
        if (filters.minPrice !== undefined) {
          filteredProperties = filteredProperties.filter(
            (p) => p.price >= filters.minPrice!
          );
        }
        if (filters.maxPrice !== undefined) {
          filteredProperties = filteredProperties.filter(
            (p) => p.price <= filters.maxPrice!
          );
        }
        if (filters.year) {
          filteredProperties = filteredProperties.filter(
            (p) => p.year === filters.year
          );
        }
        if (filters.owner) {
          filteredProperties = filteredProperties.filter((p) =>
            p.owner?.name.toLowerCase().includes(filters.owner!.toLowerCase())
          );
        }
      }

      // Simulate pagination
      const startIndex = pagination
        ? (pagination.page - 1) * pagination.pageSize
        : 0;
      const endIndex = pagination
        ? startIndex + pagination.pageSize
        : filteredProperties.length;
      const paginatedProperties = filteredProperties.slice(
        startIndex,
        endIndex
      );

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        data: paginatedProperties,
        success: true,
        total: filteredProperties.length,
      };
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return {
        data: mockProperties.slice(0, 6), // Return first 6 as fallback
        success: false,
        message: "Failed to fetch properties, showing mock data",
        total: mockProperties.length,
      };
    }
  }

  async getPropertyById(id: number): Promise<ApiResponse<Property | null>> {
    try {
      // const response = await apiClient.get<Property>(`/api/properties/${id}`);

      const property = mockProperties.find((p) => p.id === id);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        data: property || null,
        success: true,
      };
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      const property = mockProperties.find((p) => p.id === id);
      return {
        data: property || null,
        success: false,
        message: "Failed to fetch property details",
      };
    }
  }

  async getPropertySummary(): Promise<ApiResponse<PropertySummary>> {
    try {
      // const response = await apiClient.get<PropertySummary>('/api/properties/summary');

      const totalProperties = mockProperties.length;
      const totalValue = mockProperties.reduce((sum, p) => sum + p.price, 0);
      const averagePrice = totalValue / totalProperties;

      return {
        data: {
          totalProperties,
          totalValue,
          averagePrice,
        },
        success: true,
      };
    } catch (error) {
      console.warn("API call failed:", error);
      return {
        data: {
          totalProperties: 0,
          totalValue: 0,
          averagePrice: 0,
        },
        success: false,
        message: "Failed to fetch property summary",
      };
    }
  }
}

export class OwnerService {
  async getOwners(): Promise<ApiResponse<Owner[]>> {
    try {
      // const response = await apiClient.get<Owner[]>('/api/owners');

      return {
        data: mockOwners,
        success: true,
      };
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      return {
        data: mockOwners,
        success: false,
        message: "Failed to fetch owners",
      };
    }
  }

  async getOwnerById(id: number): Promise<ApiResponse<Owner | null>> {
    try {
      // const response = await apiClient.get<Owner>(`/api/owners/${id}`);

      const owner = mockOwners.find((o) => o.id === id);
      return {
        data: owner || null,
        success: true,
      };
    } catch (error) {
      console.warn("API call failed, using mock data:", error);
      const owner = mockOwners.find((o) => o.id === id);
      return {
        data: owner || null,
        success: false,
        message: "Failed to fetch owner details",
      };
    }
  }
}

// Export service instances
export const propertyService = new PropertyService();
export const ownerService = new OwnerService();

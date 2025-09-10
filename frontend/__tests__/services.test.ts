// Mock the lib/api module
jest.mock("../lib/api", () => {
  const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  return {
    ApiClient: jest.fn().mockImplementation(() => mockApiClient),
    config: { baseUrl: "http://localhost:5001", timeout: 10000 },
    apiClient: mockApiClient,
  };
});

import { propertyService, ownerService } from "../services";
import { apiClient } from "../lib/api";

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("PropertyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProperties", () => {
    it("should fetch properties with filters", async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: "Test Property",
            address: "Test Address",
            price: 250000,
            year: 2020,
            codeInternal: "TEST001",
            idOwner: 1,
          },
        ],
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const filters = { name: "Test", minPrice: 100000 };
      const result = await propertyService.getProperties(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/properties?name=Test&minPrice=100000"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error");
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(propertyService.getProperties()).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("getPropertyById", () => {
    it("should fetch property by ID", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Test Property",
          address: "Test Address",
          price: 250000,
          year: 2020,
          codeInternal: "TEST001",
          idOwner: 1,
        },
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await propertyService.getPropertyById("1");

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/properties/1");
      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("Property not found");
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(propertyService.getPropertyById("999")).rejects.toThrow(
        "Property not found"
      );
    });
  });

  describe("getPropertySummary", () => {
    it("should fetch property summary", async () => {
      const mockResponse = {
        data: {
          totalProperties: 10,
          totalValue: 2500000,
          averagePrice: 250000,
        },
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await propertyService.getPropertySummary();

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/properties/summary");
      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error");
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(propertyService.getPropertySummary()).rejects.toThrow(
        "API Error"
      );
    });
  });
});

describe("OwnerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllOwners", () => {
    it("should fetch all owners", async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: "John Doe",
            address: "Owner Address",
            birthday: "1980-01-01",
          },
        ],
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await ownerService.getAllOwners();

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/owners");
      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error");
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(ownerService.getAllOwners()).rejects.toThrow("API Error");
    });
  });
});

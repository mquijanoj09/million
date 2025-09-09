"use client";

import { useState, useEffect } from "react";
import { Property, PropertyFilter, PaginationParams } from "../types";
import { propertyService } from "../services";
import LoadingSpinner, { LoadingCard } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorBoundary";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 8,
  });
  const [total, setTotal] = useState(0);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await propertyService.getProperties(filters, pagination);

      if (response.success) {
        setProperties(response.data);
        setTotal(response.total || 0);
      } else {
        setError(response.message || "Failed to fetch properties");
        setProperties(response.data); // Still show mock data
        setTotal(response.total || 0);
      }
    } catch (err) {
      setError("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, pagination]);

  const handleFilterChange = (newFilters: PropertyFilter) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const totalPages = Math.ceil(total / pagination.pageSize);

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto px-6 md:px-10 lg:px-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600">Browse our available properties</p>
          </div>

          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-6 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Browse our available properties</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={fetchProperties} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={() => setFilters({})}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {properties.length} of {total} properties
            {Object.keys(filters).length > 0 && " (filtered)"}
          </p>
          {loading && properties.length > 0 && <LoadingSpinner size="sm" />}
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === pagination.page;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more results.
              </p>
              <button
                onClick={() => setFilters({})}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

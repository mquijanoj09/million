"use client";

import { useState, useEffect } from "react";
import { Property, PropertySummary } from "../types";
import { propertyService } from "../services";
import { LoadingCard, LoadingTable } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorBoundary";
import PropertyCard from "./PropertyCard";

export default function Dashboard() {
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [summary, setSummary] = useState<PropertySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent properties (first 4)
      const propertiesResponse = await propertyService.getProperties(
        {},
        { page: 1, pageSize: 6 }
      );
      if (propertiesResponse.success) {
        setRecentProperties(propertiesResponse.data);
      }

      // Fetch summary stats
      const summaryResponse = await propertyService.getPropertySummary();
      if (summaryResponse.success) {
        setSummary(summaryResponse.data);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !summary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Real Estate Dashboard
            </h1>
            <p className="text-gray-600">Overview of your property portfolio</p>
          </div>

          {/* Loading skeleton */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LoadingTable />
              <LoadingCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className=" mx-auto px-6 md:px-10 lg:px-12 py-8">
          <ErrorMessage message={error} onRetry={fetchData} />
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Real Estate Dashboard
        </h1>
        <p className="text-gray-600">Overview of your property portfolio</p>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Properties
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.totalProperties}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.totalValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Price
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.averagePrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Recent Properties */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Properties
              </h2>
              <a
                href="/properties"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </a>
            </div>

            {recentProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No properties found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { PropertyFilter } from "../types";

interface PropertyFiltersProps {
  filters: PropertyFilter;
  onFilterChange: (filters: PropertyFilter) => void;
  onReset: () => void;
}

export default function PropertyFilters({
  filters,
  onFilterChange,
  onReset,
}: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PropertyFilter>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (
    key: keyof PropertyFilter,
    value: string | number | undefined
  ) => {
    const newFilters = { ...localFilters };

    if (value === "" || value === undefined) {
      delete newFilters[key];
    } else {
      (newFilters as any)[key] = value;
    }

    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Filter Properties
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {Object.keys(filters).length} filter
              {Object.keys(filters).length !== 1 ? "s" : ""} active
            </span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={`${isExpanded ? "block" : "hidden"} lg:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Property Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Property Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Search by name..."
              value={localFilters.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="Search by location..."
              value={localFilters.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Min Price */}
          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Min Price
            </label>
            <input
              id="minPrice"
              type="number"
              placeholder="$0"
              value={localFilters.minPrice || ""}
              onChange={(e) =>
                handleInputChange(
                  "minPrice",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Max Price */}
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Max Price
            </label>
            <input
              id="maxPrice"
              type="number"
              placeholder="$999,999,999"
              value={localFilters.maxPrice || ""}
              onChange={(e) =>
                handleInputChange(
                  "maxPrice",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Year Built */}
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Year Built
            </label>
            <input
              id="year"
              type="number"
              placeholder="e.g., 2020"
              value={localFilters.year || ""}
              onChange={(e) =>
                handleInputChange(
                  "year",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Owner */}
          <div>
            <label
              htmlFor="owner"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Owner Name
            </label>
            <input
              id="owner"
              type="text"
              placeholder="Search by owner..."
              value={localFilters.owner || ""}
              onChange={(e) => handleInputChange("owner", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleApplyFilters}
            disabled={!hasChanges}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors"
          >
            Apply Filters
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md transition-colors"
            >
              Clear All
            </button>
          )}

          {hasChanges && (
            <button
              onClick={() => setLocalFilters(filters)}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Quick Price Filters */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Quick Price Ranges:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Under $300K", min: 0, max: 300000 },
              { label: "$300K - $500K", min: 300000, max: 500000 },
              { label: "$500K - $800K", min: 500000, max: 800000 },
              { label: "$800K - $1M", min: 800000, max: 1000000 },
              { label: "Over $1M", min: 1000000, max: undefined },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  const newFilters = {
                    ...localFilters,
                    minPrice: range.min,
                    maxPrice: range.max,
                  };
                  setLocalFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

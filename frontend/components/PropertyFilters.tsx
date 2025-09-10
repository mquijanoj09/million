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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
    setIsModalOpen(false);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters);

  // Count active filters more intelligently
  const getActiveFilterCount = (filterObj: PropertyFilter) => {
    let count = 0;
    if (filterObj.name) count++;
    if (filterObj.address) count++;
    if (filterObj.minPrice !== undefined || filterObj.maxPrice !== undefined)
      count++; // Price range counts as 1 filter
    if (filterObj.year) count++;
    if (filterObj.owner) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount(filters);
  console.log("Active Filter Count:", activeFilterCount);

  return (
    <>
      {/* Filter Button */}
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen((prev) => !prev)}
          className="flex items-center cursor-pointer space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Filter Properties</span>
          {hasActiveFilters && (
            <span className="bg-white bg-opacity-20 text-indigo-600 px-2 py-1 ml-2 rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="bg-white rounded-lg shadow-xl w-full overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Properties
            </h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  {activeFilterCount} filter
                  {activeFilterCount !== 1 ? "s" : ""} active
                </span>
              )}
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Price Filters */}
            <div className="mb-6 pt-4 border-t border-gray-100">
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
                ].map((range) => {
                  const isSelected =
                    localFilters.minPrice === range.min &&
                    localFilters.maxPrice === range.max;

                  return (
                    <button
                      key={range.label}
                      onClick={() => {
                        const newFilters = {
                          ...localFilters,
                          minPrice: range.min,
                          maxPrice: range.max,
                        };
                        setLocalFilters(newFilters);
                      }}
                      className={`text-sm px-3 py-1 rounded-full transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700"
                      }`}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleApplyFilters}
                disabled={!hasChanges}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors"
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

              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

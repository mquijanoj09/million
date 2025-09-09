"use client";

import { Property } from "../types";
import Link from "next/link";
import { formatPrice } from "../lib/formatPrice";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const getLocationParts = (address: string) => {
    const parts = address.split(", ");
    return {
      street: parts[0] || "",
      city: parts.slice(1).join(", ") || "",
    };
  };

  const location = getLocationParts(property.address);

  return (
    <Link href={`/properties/${property.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer h-full">
        {/* Property Image Placeholder */}

        <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-indigo-100 to-indigo-200">
          <div className="w-full h-60 md:h-72 lg:h-96 bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
            {property.photo ? (
              <img
                src={property.photo}
                alt={property.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <svg
                className="w-16 h-16 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </span>
          </div>

          {/* Property Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {property.name}
          </h3>

          {/* Address */}
          <div className="mb-3">
            <p className="text-sm text-gray-600 line-clamp-1">
              {location.street}
            </p>
            <p className="text-sm text-gray-500 line-clamp-1">
              {location.city}
            </p>
          </div>

          {/* Property Details */}
          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Built {property.year}</span>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
              {property.codeInternal}
            </div>
          </div>

          {/* Owner Info */}
          {property.owner && (
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="truncate">Owner: {property.owner.name}</span>
            </div>
          )}

          {/* View Details Button */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-indigo-600 font-medium text-sm">
                View Details
              </span>
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

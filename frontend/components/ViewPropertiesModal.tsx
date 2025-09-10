"use client";

import { useState, useEffect } from "react";
import { Property } from "../types";
import { propertyService } from "../services";
import Modal from "./Modal";
import LoadingSpinner from "./LoadingSpinner";
import { formatPrice } from "../lib/formatPrice";

interface ViewPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: number;
  ownerName: string;
}

export default function ViewPropertiesModal({
  isOpen,
  onClose,
  ownerId,
  ownerName,
}: ViewPropertiesModalProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnerProperties = async () => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    try {
      const response = await propertyService.getProperties();
      if (response.success) {
        // Filter properties by owner ID
        const ownerProperties = response.data.filter(
          (property) => property.owner?.id === ownerId
        );
        setProperties(ownerProperties);
      } else {
        setError("Failed to fetch properties");
      }
    } catch (err) {
      setError("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerProperties();
  }, [isOpen, ownerId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${ownerName}'s Properties`}
    >
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
            <span className="ml-2 text-gray-600">Loading properties...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">{error}</div>
            <button
              onClick={fetchOwnerProperties}
              className="text-indigo-600 hover:text-indigo-700 text-sm"
            >
              Try again
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Properties
            </h3>
            <p className="text-gray-600">
              {ownerName} doesn't own any properties in our system.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {property.name}
                    </h4>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      #{property.codeInternal}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    Built in {property.year}
                  </span>
                  <a
                    href={`/properties/${property.id}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

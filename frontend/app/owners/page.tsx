"use client";

import { useState, useEffect } from "react";
import { Owner } from "../types";
import { ownerService } from "../services";
import Header from "../components/Header";
import LoadingSpinner, { LoadingCard } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorBoundary";
import ContactOwnerModal from "../components/ContactOwnerModal";
import ViewPropertiesModal from "../components/ViewPropertiesModal";

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [viewPropertiesModalOpen, setViewPropertiesModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ownerService.getOwners();
      if (response.success) {
        setOwners(response.data);
      } else {
        setError(response.message || "Failed to fetch owners");
        setOwners(response.data); // Still show mock data
      }
    } catch (err) {
      setError("Failed to fetch owners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthday: string) => {
    const birth = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  const handleViewProperties = (owner: Owner) => {
    setSelectedOwner(owner);
    setViewPropertiesModalOpen(true);
  };

  const handleContactOwner = (owner: Owner) => {
    setSelectedOwner(owner);
    setContactModalOpen(true);
  };

  if (loading && owners.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className=" mx-auto px-6 md:px-10 lg:px-12 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Property Owners
            </h1>
            <p className="text-gray-600">
              Seacrh property owners and their information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className=" mx-auto px-6 md:px-10 lg:px-12 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Property Owners</h1>
          <p className="text-gray-600">
            Search property owners and their information
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={fetchOwners} />
          </div>
        )}

        {/* Owners Grid */}
        {owners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {owners.map((owner) => (
              <div
                key={owner.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Owner Avatar */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    {owner.photo ? (
                      <img
                        src={owner.photo}
                        alt={owner.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-10 h-10 text-blue-500"
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
                    )}
                  </div>
                </div>

                {/* Owner Information */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {owner.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Age: {calculateAge(owner.birthday)} years
                  </p>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <div className="flex items-start space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">{owner.address}</p>
                  </div>
                </div>

                {/* Birthday */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                    <p className="text-sm text-gray-600">
                      {formatDate(owner.birthday)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleViewProperties(owner)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md transition-colors"
                  >
                    View Properties
                  </button>
                  <button
                    onClick={() => handleContactOwner(owner)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-md transition-colors"
                  >
                    Contact Owner
                  </button>
                </div>

                {/* Owner ID Badge */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      ID: {owner.id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No owners found
              </h3>
              <p className="text-gray-600 mb-4">
                There are no property owners to display.
              </p>
            </div>
          )
        )}

        {/* Loading indicator when refreshing */}
        {loading && owners.length > 0 && (
          <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-600">Refreshing...</span>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ContactOwnerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        ownerName={selectedOwner?.name}
      />

      {selectedOwner && (
        <ViewPropertiesModal
          isOpen={viewPropertiesModalOpen}
          onClose={() => setViewPropertiesModalOpen(false)}
          ownerId={selectedOwner.id}
          ownerName={selectedOwner.name}
        />
      )}
    </div>
  );
}

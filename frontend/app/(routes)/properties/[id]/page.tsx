"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Property } from "../../../../types";
import { propertyService } from "../../../../services";
import Header from "../../../../components/Header";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { ErrorMessage } from "../../../../components/ErrorBoundary";
import ContactOwnerModal from "../../../../components/ContactOwnerModal";
import ScheduleViewingModal from "../../../../components/ScheduleViewingModal";
import { formatPrice } from "@/lib/formatPrice";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [viewingModalOpen, setViewingModalOpen] = useState(false);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      const propertyResponse = await propertyService.getPropertyById(
        propertyId
      );
      if (propertyResponse.success && propertyResponse.data) {
        setProperty(propertyResponse.data);
      } else {
        setError("Property not found");
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch property details");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <main className=" mx-auto px-6 md:px-10 lg:px-12 py-8">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className=" mx-auto px-6 md:px-10 lg:px-12 py-8">
        <ErrorMessage
          message={error || "Property not found"}
          onRetry={fetchProperty}
        />
      </main>
    );
  }

  const handleDownloadReport = () => {
    // Simulate download
    toast.success("Report downloaded successfully!", {
      description: `Property report for ${property?.name} has been downloaded to your device.`,
    });
  };

  return (
    <div>
      <main className=" mx-auto px-6 md:px-10 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-gray-700">
                Home
              </a>
            </li>
            <li>
              <span>›</span>
            </li>
            <li>
              <a href="/properties" className="hover:text-gray-700">
                Properties
              </a>
            </li>
            <li>
              <span>›</span>
            </li>
            <li className="text-gray-900">{property.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Property Image Placeholder */}
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-indigo-100 to-indigo-200">
                <div className="w-full h-96 bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  {property.photo ? (
                    <img
                      src={property.photo}
                      alt={property.name}
                      className="object-cover w-full h-full"
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

              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-4 gap-4 sm:gap-0">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {property.name}
                    </h1>
                    <p className="text-lg text-gray-600">{property.address}</p>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-3xl font-bold text-green-600">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Code: {property.codeInternal}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {property.year}
                    </div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      Active
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Property Description
              </h2>
              <div className="prose text-gray-600">
                <p>
                  This beautiful property offers excellent value in a prime
                  location. Built in {property.year}, this{" "}
                  {property.name.toLowerCase()} features modern amenities and
                  classic architecture. The property is well-maintained and
                  offers great potential for both residential and investment
                  purposes.
                </p>
                <p>
                  Located at {property.address}, this property provides easy
                  access to local amenities, transportation, and recreational
                  facilities. The neighborhood is known for its safety,
                  community spirit, and excellent schools.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            {property.owner && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Owner Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-600"
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
                    <div>
                      <div className="font-medium text-gray-900">
                        {property.owner.name}
                      </div>
                      <div className="text-sm text-gray-600">Owner</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setContactModalOpen(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Contact Owner
                </button>
                <button
                  onClick={() => setViewingModalOpen(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                >
                  Schedule Viewing
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                >
                  Download Report
                </button>
              </div>
            </div>

            {/* Property Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Age</span>
                  <span className="font-medium">
                    {new Date().getFullYear() - property.year} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Year</span>
                  <span className="font-medium">
                    {formatPrice(
                      property.price /
                        (new Date().getFullYear() - property.year + 1)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ContactOwnerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        ownerName={property?.owner?.name}
      />

      <ScheduleViewingModal
        isOpen={viewingModalOpen}
        onClose={() => setViewingModalOpen(false)}
        propertyName={property?.name}
      />
    </div>
  );
}

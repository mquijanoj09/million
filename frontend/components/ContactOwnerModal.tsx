"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "./Modal";

interface ContactOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName?: string;
}

export default function ContactOwnerModal({
  isOpen,
  onClose,
  ownerName = "Owner",
}: ContactOwnerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(`Message sent to ${ownerName} successfully!`, {
      description: "We'll notify you when they respond.",
    });

    setIsSubmitting(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Contact ${ownerName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject *
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select a subject</option>
            <option value="property-inquiry">Property Inquiry</option>
            <option value="viewing-request">Viewing Request</option>
            <option value="general-question">General Question</option>
            <option value="maintenance-issue">Maintenance Issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="Enter your message..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

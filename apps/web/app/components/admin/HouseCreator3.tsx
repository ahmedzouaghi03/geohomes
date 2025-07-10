"use client";

import React from "react";
import FileUploader from "@/components/admin/FileUploader";
import { toast } from "react-hot-toast";
import { CreateHouseData } from "@/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface HouseCreator3Props {
  formData: {
    title: string;
    description?: string;
    prixMin?: number;
    prixMax?: number;
    startDate?: Date | string;
    endDate?: Date | string;
    images: string[];
  };
  updateFormData: (data: Partial<CreateHouseData>) => void;
}

interface UploadResponse {
  url: string;
  ufsUrl: string;
}

export default function HouseCreator3({
  formData,
  updateFormData,
}: HouseCreator3Props) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle date inputs
    if (name === "startDate" || name === "endDate") {
      updateFormData({ [name]: value ? new Date(value) : undefined });
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleImageUpload = (res: UploadResponse[]) => {
    if (res.length > 0) {
      const uploadedImageUrl = res[0].url || res[0].ufsUrl || "";
      const updatedImages = [...formData.images, uploadedImageUrl];
      updateFormData({ images: updatedImages });
      toast.success("Image uploaded successfully!");
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    updateFormData({ images: updatedImages });
  };

  // Format dates for input fields
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-8 py-4">
      <h2
        className="text-2xl font-semibold mb-6"
        style={{ color: "var(--foreground)" }}
      >
        Property Details & Media
      </h2>

      {/* Basic Information */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Property Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{
              borderColor: "var(--input)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md  focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{
              borderColor: "var(--input)",
              color: "var(--foreground)",
            }}
          />
        </div>
      </div>

      {/* Price Information */}
      <div
        className="pt-6 border-t border-gray-200"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Price Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <label
              htmlFor="prixMin"
              className="block text-sm font-medium mb-2 text-blue-600"
            >
              Minimum Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                id="prixMin"
                name="prixMin"
                value={formData.prixMin || ""}
                onChange={handleInputChange}
                className="w-full pl-8 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                style={{
                  borderColor: "var(--input)",
                  color: "var(--foreground)",
                }}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <label
              htmlFor="prixMax"
              className="block text-sm font-medium mb-2 text-blue-600"
            >
              Maximum Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                id="prixMax"
                name="prixMax"
                value={formData.prixMax || ""}
                onChange={handleInputChange}
                className="w-full pl-8 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                style={{
                  borderColor: "var(--input)",
                  color: "var(--foreground)",
                }}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Simple Price Range Indicator */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Price Range:</span>
            <span
              className="font-medium"
              style={{ color: "var(--foreground)" }}
            >
              ${formData.prixMin || "0"} - ${formData.prixMax || "∞"}
            </span>
          </div>
        </div>
      </div>

      {/* Availability Period - with react-datepicker */}
      <div
        className="pt-6 border-t border-gray-200"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Availability Period
        </h3>

        {/* Add these imports at the top of your file:
        import DatePicker from "react-datepicker";
        import "react-datepicker/dist/react-datepicker.css";
        */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium mb-2 text-blue-600"
            >
              Start Date
            </label>
            <DatePicker
              selected={
                formData.startDate ? new Date(formData.startDate) : null
              }
              onChange={(date) =>
                updateFormData({ startDate: date || undefined })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholderText="Select start date"
              dateFormat="MMMM d, yyyy"
              id="startDate"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium mb-2 text-blue-600"
            >
              End Date
            </label>
            <DatePicker
              selected={formData.endDate ? new Date(formData.endDate) : null}
              onChange={(date) =>
                updateFormData({ endDate: date || undefined })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholderText="Select end date"
              dateFormat="MMMM d, yyyy"
              id="endDate"
              minDate={
                formData.startDate ? new Date(formData.startDate) : undefined
              }
            />
          </div>
        </div>

        {/* Duration display */}
        {formData.startDate && formData.endDate && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200 text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span
                className="font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Duration:{" "}
                {Math.ceil(
                  (new Date(formData.endDate).getTime() -
                    new Date(formData.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div
        className="pt-6 border-t border-gray-200"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Property Images
        </h3>

        <div className="flex flex-wrap gap-4 mb-6">
          {formData.images.map((imageUrl, index) => (
            <div key={index} className="relative w-32 h-32 group">
              <img
                src={imageUrl}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}

          {formData.images.length === 0 && (
            <div
              className="w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400"
              style={{ borderColor: "var(--border)" }}
            >
              No images
            </div>
          )}
        </div>

        <FileUploader
          handleUploadComplete={handleImageUpload}
          buttonText="Upload Image"
        />
      </div>
    </div>
  );
}

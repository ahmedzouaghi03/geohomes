"use client";

import React, { useState, useEffect } from "react";
import HouseCreator1 from "@/components/admin/HouseCreator1";
import HouseCreator2 from "@/components/admin/HouseCreator2";
import HouseCreator3 from "@/components/admin/HouseCreator3";
import { createHouse } from "@/actions/houseActions";
import { getCities } from "@/actions/cityActions";
import { getCurrentUser } from "@/actions/authActions";
import { getAdminById } from "@/api/auth/currentUser/route";
import { toast } from "react-hot-toast";
import {
  HouseCategory,
  HouseType,
  HouseState,
  SolType,
  Emplacement,
  Governorat,
  GardenType,
  HeatingType,
  City,
  CreateHouseData,
} from "@/types";

export default function CreateHousePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cities, setCities] = useState<City[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function setAdminInfo() {
      const admin = await getCurrentUser();
      console.log("Admin data:", admin);

      if (admin?.id) {
        const adminFromApi = await getAdminById(admin.id);
        setFormData((prev) => ({
          ...prev,
          adminId: admin.id,
          phoneNumbers: adminFromApi?.phoneNumbers || [],
        }));
      }
    }
    setAdminInfo();
  }, []);

  // Initial form data with default values
  const [formData, setFormData] = useState<CreateHouseData>({
    title: HouseType.APPARTEMENT,
    description: "",
    area: undefined,
    rooms: 1,
    bathrooms: 1,
    toilets: 1,
    floors: undefined,

    category: HouseCategory.LOCATION,
    type: HouseType.APPARTEMENT,
    emplacement: Emplacement.RDC,
    state: HouseState.BON_ETAT,
    solType: SolType.CARRELAGE,

    images: [] as string[],
    prixMin: undefined,
    prixMax: undefined,

    startDate: undefined,
    endDate: undefined,

    // Position data
    position: {
      address: "",
      mapPosition: "",
      governorat: Governorat.SOUSSE,
      cityId: "",
    },

    // Options data
    options: {
      piscine: false,
      piedDansEau: false,
      elevator: false,
      clim: false,
      internet: false,
      garden: GardenType.NONE,
      heating: HeatingType.NONE,
      porteBlinde: false,
      doubleVitrage: false,
      cameraSecurite: false,
      concierge: true,
      furnished: true,
      kitchenEquipped: true,
      refrigerator: false,
      four: false,
      tv: false,
      washingMachine: false,
      microwave: false,
      entreSeul: true,
      garage: false,
      parking: false,
      terrasse: false,
      animalAuthorized: false,
    },

    // Admin reference (will be set from session)
    adminId: "",
    phoneNumbers: [],
  });

  useEffect(() => {
    if (formData.type) {
      setFormData((prev) => ({
        ...prev,
        title: formData.type + " pour " + formData.category.toLowerCase(),
      }));
    }
  }, [formData.type]);

  // Fetch cities data
  useEffect(() => {
    async function fetchCities() {
      try {
        const result = await getCities();
        if (result.success) {
          setCities(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        toast.error("Failed to load cities data");

        // Fallback to hardcoded data if server action fails
        const citiesData = [
          { id: "city1", name: "Sousse Ville", governorat: Governorat.SOUSSE },
          { id: "city2", name: "Hammam Sousse", governorat: Governorat.SOUSSE },
          { id: "city3", name: "Msaken", governorat: Governorat.SOUSSE },
          { id: "city4", name: "Kalaa Kebira", governorat: Governorat.SOUSSE },
          { id: "city5", name: "Akouda", governorat: Governorat.SOUSSE },
        ];
        setCities(citiesData);
      }
    }

    fetchCities();
  }, []);

  // Update form data
  const updateFormData = (data: Partial<CreateHouseData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Navigate to next step
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.position.cityId && !formData.position.mapPosition) {
        toast.error("Please provide either a city or map position");
        return;
      }
    }

    if (currentStep === 2) {
      // Validate step 2
      if (formData.rooms < 1) {
        toast.error("Number of rooms must be at least 1");
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate final step
    if (!formData.title) {
      toast.error("Please provide a title");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createHouse({
        ...formData,
      });

      if (result.success) {
        toast.success("Redirecting...");
        toast.success("Property created successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Failed to create house:", error);
      toast.error(error.message || "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--foreground)" }}
      >
        Add New Property
      </h1>

      {/* Step Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

          {/* Active Progress Line */}
          <div
            className="absolute top-5 left-5 h-0.5 transition-all duration-500 ease-in-out hidden sm:block"
            style={{
              backgroundColor: "var(--primary)",
              width: `${((currentStep - 1) / 2) * 100}%`,
              maxWidth: "calc(100% - 2.5rem)",
            }}
          />

          {[
            { step: 1, label: "Property Details", icon: "🏠" },
            { step: 2, label: "Location & Features", icon: "📍" },
            { step: 3, label: "Review & Submit", icon: "✓" },
          ].map(({ step, label, icon }) => (
            <div key={step} className="flex-1 relative z-10">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
              transition-all duration-300 ease-in-out transform
              ${
                currentStep >= step
                  ? "text-white shadow-lg scale-110"
                  : currentStep === step - 1
                    ? "bg-blue-100 text-blue-[#3A5FCD] border-2 border-blue-200 shadow-md"
                    : "bg-gray-100 text-gray-400 border-2 border-gray-200"
              }
              hover:scale-105 cursor-pointer
            `}
                  style={
                    currentStep >= step
                      ? { backgroundColor: "var(--primary)" }
                      : {}
                  }
                >
                  {currentStep > step ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{step}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <div className="hidden sm:block">
                    <div
                      className={`text-xs font-medium transition-colors duration-200 ${
                        currentStep >= step
                          ? "text-blue-[#3A5FCD] dark:text-blue-[#3A5FCD]"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {label}
                    </div>
                  </div>

                  {/* Mobile: Show only current step label */}
                  <div className="sm:hidden">
                    {currentStep === step && (
                      <div className="text-xs font-medium text-blue-[#3A5FCD] dark:text-[#3A5FCD] animate-fade-in">
                        {label}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                backgroundColor: "var(--primary)",
                width: `${(currentStep / 3) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        {currentStep === 1 && (
          <HouseCreator1
            formData={formData}
            updateFormData={updateFormData}
            cities={cities}
          />
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <HouseCreator2 formData={formData} updateFormData={updateFormData} />
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <HouseCreator3 formData={formData} updateFormData={updateFormData} />
        )}

        {/* Navigation Buttons */}
        <div
          className="mt-8 flex justify-between pt-5 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 border rounded-md transition-colors"
              style={{
                borderColor: "var(--input)",
                color: "var(--foreground)",
              }}
              disabled={isSubmitting}
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-md transition-colors"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 rounded-md transition-colors"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Finish"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

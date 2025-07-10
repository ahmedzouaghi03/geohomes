"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { getCurrentUser } from "@/actions/authActions";
import { getHouseById, updateHouse } from "@/actions/houseActions";
import { getCities } from "@/actions/cityActions";
import { House, City, CreateHouseData, UpdateHouseData } from "@/types";
import HouseCreator1 from "@/components/admin/HouseCreator1";
import HouseCreator2 from "@/components/admin/HouseCreator2";
import HouseCreator3 from "@/components/admin/HouseCreator3";

export default function EditHousePage() {
  const router = useRouter();
  const params = useParams();
  const houseId = params.id as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [house, setHouse] = useState<House | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminId, setAdminId] = useState<string>("");

  // Form data state
  const [formData, setFormData] = useState<CreateHouseData>({
    title: "",
    description: "",
    area: undefined,
    rooms: 1,
    bathrooms: 1,
    toilets: 1,
    floors: undefined,

    category: "LOCATION" as any,
    type: "APPARTEMENT" as any,
    emplacement: "RDC" as any,
    state: "BON_ETAT" as any,
    solType: "CARRELAGE" as any,

    images: [],
    prixMin: undefined,
    prixMax: undefined,

    startDate: undefined,
    endDate: undefined,

    position: {
      address: "",
      mapPosition: "",
      governorat: "SOUSSE" as any,
      cityId: "",
    },

    options: {
      piscine: false,
      piedDansEau: false,
      elevator: false,
      clim: false,
      internet: false,
      garden: "NONE" as any,
      heating: "NONE" as any,
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

    adminId: "",
    phoneNumbers: [],
  });

  useEffect(() => {
    if (houseId) {
      loadHouseData();
      loadCities();
      checkAdminAuth();
    }
  }, [houseId]);

  const checkAdminAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser?.id) {
        toast.error("You must be logged in");
        router.push("/auth/login");
        return;
      }
      setAdminId(currentUser.id);
    } catch (error) {
      toast.error("Authentication failed");
      router.push("/auth/login");
    }
  };

  const loadHouseData = async () => {
    try {
      setLoading(true);
      const result = await getHouseById(houseId);

      if (result.success) {
        const houseData = result.data as House;
        setHouse(houseData);

        // Convert house data to form data format
        setFormData({
          title: houseData.title,
          description: houseData.description || "",
          area: houseData.area,
          rooms: houseData.rooms,
          bathrooms: houseData.bathrooms,
          toilets: houseData.toilets,
          floors: houseData.floors,

          category: houseData.category,
          type: houseData.type,
          emplacement: houseData.emplacement,
          state: houseData.state,
          solType: houseData.solType,

          images: houseData.images || [],
          prixMin: houseData.prixMin,
          prixMax: houseData.prixMax,

          startDate: houseData.startDate
            ? new Date(houseData.startDate)
            : undefined,
          endDate: houseData.endDate ? new Date(houseData.endDate) : undefined,

          position: {
            address: houseData.position?.address || "",
            mapPosition: houseData.position?.mapPosition || "",
            governorat: houseData.position?.governorat || ("SOUSSE" as any),
            cityId: houseData.position?.cityId || "",
          },

          options: {
            piscine: houseData.options?.piscine || false,
            piedDansEau: houseData.options?.piedDansEau || false,
            elevator: houseData.options?.elevator || false,
            clim: houseData.options?.clim || false,
            internet: houseData.options?.internet || false,
            garden: houseData.options?.garden || ("NONE" as any),
            heating: houseData.options?.heating || ("NONE" as any),
            porteBlinde: houseData.options?.porteBlinde || false,
            doubleVitrage: houseData.options?.doubleVitrage || false,
            cameraSecurite: houseData.options?.cameraSecurite || false,
            concierge: houseData.options?.concierge || true,
            furnished: houseData.options?.furnished || true,
            kitchenEquipped: houseData.options?.kitchenEquipped || true,
            refrigerator: houseData.options?.refrigerator || false,
            four: houseData.options?.four || false,
            tv: houseData.options?.tv || false,
            washingMachine: houseData.options?.washingMachine || false,
            microwave: houseData.options?.microwave || false,
            entreSeul: houseData.options?.entreSeul || true,
            garage: houseData.options?.garage || false,
            parking: houseData.options?.parking || false,
            terrasse: houseData.options?.terrasse || false,
            animalAuthorized: houseData.options?.animalAuthorized || false,
          },

          adminId: houseData.admin?.id || "",
          phoneNumbers: houseData.phoneNumbers || [],
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to load house:", error);
      toast.error("Failed to load house data");
      router.push("/admin/house");
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      const result = await getCities();
      if (result.success) {
        setCities(result.data);
      } else {
        console.error("Failed to load cities:", result.error);
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
    }
  };

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
      // Prepare update data
      const updateData: UpdateHouseData = {
        id: houseId,
        title: formData.title,
        description: formData.description,
        area: formData.area,
        rooms: formData.rooms,
        bathrooms: formData.bathrooms,
        toilets: formData.toilets,
        floors: formData.floors,

        category: formData.category,
        type: formData.type,
        emplacement: formData.emplacement,
        state: formData.state,
        solType: formData.solType,

        images: formData.images,
        prixMin: formData.prixMin,
        prixMax: formData.prixMax,

        startDate: formData.startDate,
        endDate: formData.endDate,

        phoneNumbers: formData.phoneNumbers,

        position: formData.position,
        options: formData.options,
      };

      const result = await updateHouse(updateData);

      if (result.success) {
        toast.success("Property updated successfully!");
        router.push("/admin/house");
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Failed to update house:", error);
      toast.error(error.message || "Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading house data...</p>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-4">House not found</h2>
        <button
          onClick={() => router.push("/admin/house")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Back to Houses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Property</h1>
        <button
          onClick={() => router.push("/admin/house")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Houses
        </button>
      </div>

      {/* Step Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {/* Progress Bar Background */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

          {/* Progress Bar Active */}
          <div
            className="absolute top-5 left-5 h-0.5 transition-all duration-500 ease-in-out hidden sm:block"
            style={{
              backgroundColor: "var(--primary)",
              width: `${((currentStep - 1) / 2) * 100}%`,
              maxWidth: "calc(100% - 2.5rem)",
            }}
          />

          {/* Step indicators */}
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step <= currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
              <span className="mt-2 text-sm font-medium hidden sm:block">
                {step === 1 && "Location & Type"}
                {step === 2 && "Details & Features"}
                {step === 3 && "Information & Media"}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile step indicator */}
        <div className="sm:hidden mt-6">
          <div className="text-center">
            <span className="text-sm font-medium">
              Step {currentStep} of 3:{" "}
              {currentStep === 1
                ? "Location & Type"
                : currentStep === 2
                  ? "Details & Features"
                  : "Information & Media"}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Step 1: Location and Type */}
        {currentStep === 1 && (
          <HouseCreator1
            formData={formData}
            updateFormData={updateFormData}
            cities={cities}
          />
        )}

        {/* Step 2: Details and Features */}
        {currentStep === 2 && (
          <HouseCreator2 formData={formData} updateFormData={updateFormData} />
        )}

        {/* Step 3: Information and Media */}
        {currentStep === 3 && (
          <HouseCreator3 formData={formData} updateFormData={updateFormData} />
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between pt-5 border-t border-gray-200">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {isSubmitting ? "Updating..." : "Update Property"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

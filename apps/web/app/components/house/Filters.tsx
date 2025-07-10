"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HouseCategory, HouseType } from "@/types";

interface FiltersProps {
  cities: { id: string; name: string }[];
  initialFilters?: {
    category?: HouseCategory | null;
    type?: HouseType | null;
    minPrice?: string;
    maxPrice?: string;
    rooms?: string;
    cityId?: string;
    minArea?: string;
    startDate?: string;
    endDate?: string;
  };
}

const Filters: React.FC<FiltersProps> = ({ cities, initialFilters = {} }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentCategory = searchParams.get("category") as HouseCategory | null;
  const currentType = searchParams.get("type") as HouseType | null;
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentRooms = searchParams.get("rooms") || "";
  const currentCity = searchParams.get("cityId") || "";
  const currentArea = searchParams.get("minArea") || "";
  const currentStartDate = searchParams.get("startDate") || "";
  const currentEndDate = searchParams.get("endDate") || "";

  // State for advanced filters visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter state (local) - use null instead of empty string for enum types
  const [category, setCategory] = useState<HouseCategory | null>(
    initialFilters.category || null
  );
  const [type, setType] = useState<HouseType | null>(
    initialFilters.type || null
  );
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [rooms, setRooms] = useState(currentRooms);
  const [cityId, setCityId] = useState(currentCity);
  const [minArea, setMinArea] = useState(currentArea);
  const [startDate, setStartDate] = useState(currentStartDate);
  const [endDate, setEndDate] = useState(currentEndDate);

  const applyFilters = () => {
    // Build query parameters
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (rooms) params.set("rooms", rooms);
    if (cityId) params.set("cityId", cityId);
    if (minArea) params.set("minArea", minArea);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    // Preserve pagination if it exists
    const currentPage = searchParams.get("page");
    if (currentPage) params.set("page", currentPage);

    // Navigate to the same page with new filters
    router.push(`/house?${params.toString()}`);
  };

  const resetFilters = () => {
    // Use null for enum types instead of empty strings
    setCategory(null);
    setType(null);
    setMinPrice("");
    setMaxPrice("");
    setRooms("");
    setCityId("");
    setMinArea("");
    setStartDate("");
    setEndDate("");

    // Clear URL params and navigate
    router.push("/house");
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={category || ""}
            onChange={(e) => {
              const value = e.target.value;
              setCategory(value ? (value as HouseCategory) : null);
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Toutes les catégories</option>
            <option value={HouseCategory.VENTE}>À Vendre</option>
            <option value={HouseCategory.LOCATION}>À Louer</option>
            <option value={HouseCategory.LOCATION_VACANCES}>
              Location Vacances
            </option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de bien
          </label>
          <select
            value={type || ""}
            onChange={(e) => {
              const value = e.target.value;
              setType(value ? (value as HouseType) : null);
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Tous les types</option>
            <option value={HouseType.APPARTEMENT}>Appartement</option>
            <option value={HouseType.MAISON}>Maison</option>
            <option value={HouseType.VILLA}>Villa</option>
          </select>
        </div>

        {/* Rest of the component remains the same */}
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ville
          </label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Toutes les villes</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filters
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix minimum
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="TND"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix maximum
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="TND"
            className="w-full p-2 border rounded-md"
          />
        </div> */}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mt-4 flex items-center">
        <button
          type="button"
          className="text-blue-600 font-medium flex items-center"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? "- Moins de critères" : "+ Plus de critères"}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rooms Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chambres
            </label>
            <select
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Toutes</option>
              <option value="1">1+ chambre</option>
              <option value="2">2+ chambres</option>
              <option value="3">3+ chambres</option>
              <option value="4">4+ chambres</option>
              <option value="5">5+ chambres</option>
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surface minimum
            </label>
            <input
              type="number"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              placeholder="m²"
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Start Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Propriétés disponibles à partir de cette date
            </p>
          </div>

          {/* End Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Propriétés disponibles jusqu'à cette date
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Réinitialiser
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
};

export default Filters;

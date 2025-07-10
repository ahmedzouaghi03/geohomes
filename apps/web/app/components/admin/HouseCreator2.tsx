"use client";

import React from "react";
import {
  HouseType,
  Emplacement,
  SolType,
  GardenType,
  HeatingType,
  CreateHouseData,
} from "@/types";
import {
  //Pool, // Swimming Pool (piscine)
  Waves, // Waterfront (piedDansEau)
  Snowflake, // Air Conditioning (clim)
  Wifi, // Internet (internet)
  Flame, // Heating types (heating - None/Central/Fireplace)
  Shield, // Security Door (porteBlinde)
  Camera, // Security Camera (cameraSecurite)
  UserRound, // Concierge (concierge)
  Sofa, // Furnished (furnished)
  UtensilsCrossed, // Equipped Kitchen (kitchenEquipped) //or CookingPot
  Refrigerator, // Refrigerator (refrigerator)
  ChefHat as Oven, // Oven (four)
  Tv, // Television (tv)
  Shirt as ShirtFolded, // Washing Machine (washingMachine)
  Microwave, // Microwave (microwave)
  DoorOpen, // Private Entrance (entreSeul) //or Home
  Warehouse, // Garage (garage)
  ParkingSquare, // Parking (parking)
  Umbrella, // Terrace (terrasse) //or Sun
  Dog, // Pets Allowed (animalAuthorized)
} from "lucide-react";

import {
  FaSwimmingPool as Pool, // Swimming Pool (piscine)
  FaWater, // Waterfront (piedDansEau)
  FaBuilding as Elevator, // Elevator (elevator)
  FaSnowflake, // Air Conditioning (clim)
  FaWifi, // Internet (internet)
  FaTree as Tree, // Garden types (garden - None/Normal/Gazon)
  FaWindowMaximize as Window, // Double Glazing (doubleVitrage)
  FaCamera, // Security Camera (cameraSecurite)
  FaUserTie, // Concierge (concierge)
  FaCouch, // Furnished (furnished)
  FaUtensils, // Equipped Kitchen (kitchenEquipped)
  FaSnowman, // Refrigerator (refrigerator)
  FaTv, // Television (tv)
  FaTshirt, // Washing Machine (washingMachine)
  FaDoorOpen, // Private Entrance (entreSeul)
  FaWarehouse, // Garage (garage)
  FaParking, // Parking (parking)
  FaUmbrella, // Terrace (terrasse)
  FaPaw, // Pets Allowed (animalAuthorized)
} from "react-icons/fa";
interface HouseCreator2Props {
  formData: {
    type: HouseType;
    area?: number;
    rooms: number;
    bathrooms: number;
    toilets: number;
    floors?: number;
    emplacement?: Emplacement;
    solType?: SolType;
    options: {
      // Swimming and Comfort
      piscine?: boolean;
      piedDansEau?: boolean;
      elevator?: boolean;
      clim?: boolean;
      internet?: boolean;
      garden?: GardenType;
      heating?: HeatingType;

      // Security
      porteBlinde?: boolean;
      doubleVitrage?: boolean;
      cameraSecurite?: boolean;
      concierge?: boolean;

      // Furnishing
      furnished?: boolean;
      kitchenEquipped?: boolean;
      refrigerator?: boolean;
      four?: boolean;
      tv?: boolean;
      washingMachine?: boolean;
      microwave?: boolean;

      // Access and Extras
      entreSeul?: boolean;
      garage?: boolean;
      parking?: boolean;
      terrasse?: boolean;
      animalAuthorized?: boolean;
    };
  };
  updateFormData: (data: Partial<CreateHouseData>) => void;
}

export default function HouseCreator2({
  formData,
  updateFormData,
}: HouseCreator2Props) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (e.target.type === "number") {
      const numberValue = value === "" ? undefined : Number(value);
      updateFormData({ [name]: numberValue });
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isCheckbox = e.target.type === "checkbox";

    updateFormData({
      options: {
        ...formData.options,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
      },
    });
  };

  const CheckboxOption = ({ name, label }: { name: string; label: string }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={
          (formData.options[
            name as keyof typeof formData.options
          ] as boolean) || false
        }
        onChange={handleOptionsChange}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label
        htmlFor={name}
        className="ml-2 block text-sm"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
    </div>
  );

  const IconOption = ({
    name,
    label,
    icon: Icon,
  }: {
    name: string;
    label: string;
    icon: React.ElementType;
  }) => {
    const isSelected =
      (formData.options[name as keyof typeof formData.options] as boolean) ||
      false;

    return (
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => {
          updateFormData({
            options: {
              ...formData.options,
              [name]: !isSelected,
            },
          });
        }}
      >
        <div
          className={`p-5 rounded-full border ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
        >
          <Icon
            size={24}
            className={isSelected ? "text-blue-500" : "text-gray-500"}
            strokeWidth={1.5}
          />
        </div>
        <span
          className={`mt-2 text-sm text-center ${isSelected ? "text-blue-500 font-medium" : ""}`}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-8 py-4">
      <h2
        className="text-2xl font-semibold mb-6"
        style={{ color: "var(--foreground)" }}
      >
        Property Details & Features
      </h2>

      {/* Basic Details - Compact Layout */}
      <div className="space-y-6">
        {/* First line: Area, Floor Type, Floor Level (for apartments) */}
        <div className="flex flex-wrap gap-6">
          <div className="space-y-2 w-48">
            <label
              htmlFor="area"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Surface (m²)
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              style={{
                borderColor: "var(--input)",
                color: "var(--foreground)",
              }}
              min="0"
            />
          </div>

          <div className="space-y-2 w-48">
            <label
              htmlFor="solType"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Type de sol
            </label>
            <select
              id="solType"
              name="solType"
              value={formData.solType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
              style={{
                borderColor: "var(--input)",
                color: "var(--foreground)",
              }}
            >
              <option value={SolType.CARRELAGE}>Carrelage</option>
              <option value={SolType.MARBRE}>Marbre</option>
              <option value={SolType.PAQUET}>Paquet</option>
            </select>
          </div>

          {formData.type === HouseType.APPARTEMENT && (
            <div className="space-y-2 w-48">
              <label
                htmlFor="emplacement"
                className="block text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Étage
              </label>
              <select
                id="emplacement"
                name="emplacement"
                value={formData.emplacement}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                style={{
                  borderColor: "var(--input)",
                  color: "var(--foreground)",
                }}
              >
                <option value={Emplacement.RDC}>Rez-de-chaussée</option>
                <option value={Emplacement.PREMIERE_ETAGE}>
                  Premier étage
                </option>
                <option value={Emplacement.DEUXIEME_ETAGE}>
                  Deuxième étage
                </option>
                <option value={Emplacement.TROISIEME_ETAGE}>
                  Troisième étage
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Second line: Rooms, Bathrooms, Toilets, Floors */}
        <div className="flex flex-wrap gap-6">
          {/* Number of Rooms */}
          <div className="space-y-2">
            <label
              htmlFor="rooms"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Chambres <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (formData.rooms > 1) {
                    updateFormData({ rooms: formData.rooms - 1 });
                  }
                }}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="text-xl">−</span>
              </button>
              <span className="text-xl font-medium w-12 text-center text-blue-500">
                {formData.rooms}
              </span>
              <button
                type="button"
                onClick={() => updateFormData({ rooms: formData.rooms + 1 })}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          </div>

          {/* Number of Bathrooms */}
          <div className="space-y-2">
            <label
              htmlFor="bathrooms"
              className="block text-sm font-medium mb-2 "
              style={{ color: "var(--foreground)" }}
            >
              Salles de bains <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (formData.bathrooms > 0) {
                    updateFormData({ bathrooms: formData.bathrooms - 1 });
                  }
                }}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="text-xl">−</span>
              </button>
              <span className="text-xl font-medium w-12 text-center text-blue-500">
                {formData.bathrooms}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateFormData({ bathrooms: formData.bathrooms + 1 })
                }
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          </div>

          {/* Number of Toilets */}
          <div className="space-y-2">
            <label
              htmlFor="toilets"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Toilettes <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (formData.toilets > 0) {
                    updateFormData({ toilets: formData.toilets - 1 });
                  }
                }}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="text-xl">−</span>
              </button>
              <span className="text-xl font-medium w-12 text-center text-blue-500">
                {formData.toilets}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateFormData({ toilets: formData.toilets + 1 })
                }
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          </div>

          {/* Number of Floors (shown only if not an apartment) */}
          {formData.type !== HouseType.APPARTEMENT && (
            <div className="space-y-2">
              <label
                htmlFor="floors"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Étages
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if ((formData.floors || 1) > 1) {
                      updateFormData({ floors: (formData.floors || 1) - 1 });
                    }
                  }}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <span className="text-xl">−</span>
                </button>
                <span className="text-xl font-medium w-12 text-center text-blue-500">
                  {formData.floors || 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateFormData({ floors: (formData.floors || 1) + 1 })
                  }
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Swimming and Comfort */}
      <div
        className="pt-8 border-t border-gray-200"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-lg font-medium mb-6"
          style={{ color: "var(--foreground)" }}
        >
          Natation et confort
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <IconOption name="piscine" label="Piscine" icon={Pool} />
          <IconOption name="piedDansEau" label="Pied dans l'eau" icon={Waves} />
          <IconOption name="elevator" label="Assenceur" icon={Elevator} />
          <IconOption name="clim" label="Climatiseur" icon={Snowflake} />
          <IconOption name="internet" label="Internet" icon={Wifi} />

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => {
              const nextType =
                formData.options.garden === GardenType.NONE
                  ? GardenType.NORMAL
                  : formData.options.garden === GardenType.NORMAL
                    ? GardenType.GAZON
                    : GardenType.NONE;

              updateFormData({
                options: {
                  ...formData.options,
                  garden: nextType,
                },
              });
            }}
          >
            <div
              className={`p-5 rounded-full border ${formData.options.garden !== GardenType.NONE ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            >
              <Tree
                size={24}
                className={
                  formData.options.garden !== GardenType.NONE
                    ? "text-blue-500"
                    : "text-gray-500"
                }
                strokeWidth={1.5}
              />
            </div>
            <span
              className={`mt-2 text-sm text-center ${formData.options.garden !== GardenType.NONE ? "text-blue-500 font-medium" : ""}`}
            >
              {formData.options.garden === GardenType.NONE
                ? "Pas de Jardin"
                : formData.options.garden === GardenType.NORMAL
                  ? "Jardin Simple"
                  : "Gazon"}
            </span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => {
              const nextType =
                formData.options.heating === HeatingType.NONE
                  ? HeatingType.CHAUFFAGE_CENTRALE
                  : formData.options.heating === HeatingType.CHAUFFAGE_CENTRALE
                    ? HeatingType.CHEMINE
                    : HeatingType.NONE;

              updateFormData({
                options: {
                  ...formData.options,
                  heating: nextType,
                },
              });
            }}
          >
            <div
              className={`p-5 rounded-full border ${formData.options.heating !== HeatingType.NONE ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            >
              <Flame
                size={24}
                className={
                  formData.options.heating !== HeatingType.NONE
                    ? "text-blue-500"
                    : "text-gray-500"
                }
                strokeWidth={1.5}
              />
            </div>
            <span
              className={`mt-2 text-sm text-center ${formData.options.heating !== HeatingType.NONE ? "text-blue-500 font-medium" : ""}`}
            >
              {formData.options.heating === HeatingType.NONE
                ? "Pas de chauffage"
                : formData.options.heating === HeatingType.CHAUFFAGE_CENTRALE
                  ? "Chauffage central"
                  : "Cheminée"}
            </span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div
        className="pt-8 border-t border-gray-200 mt-8"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-lg font-medium mb-6"
          style={{ color: "var(--foreground)" }}
        >
          Options de sécurité
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <IconOption name="porteBlinde" label="Porte Blindé" icon={Shield} />
          <IconOption
            name="doubleVitrage"
            label="Double Vitrage"
            icon={Window}
          />
          <IconOption
            name="cameraSecurite"
            label="Camera de Sécurité"
            icon={Camera}
          />
          <IconOption name="concierge" label="Concierge" icon={UserRound} />
        </div>
      </div>

      {/* Furnishing */}
      <div
        className="pt-8 border-t border-gray-200 mt-8"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-lg font-medium mb-6"
          style={{ color: "var(--foreground)" }}
        >
          Ameublement et appareils électroménagers
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          <IconOption name="furnished" label="Equipée" icon={Sofa} />
          <IconOption
            name="kitchenEquipped"
            label="Cuisine Equipée"
            icon={UtensilsCrossed}
          />
          <IconOption
            name="refrigerator"
            label="Refrigerateur"
            icon={Refrigerator}
          />
          <IconOption name="four" label="Four" icon={Oven} />
          <IconOption name="tv" label="TV" icon={Tv} />
          <IconOption
            name="washingMachine"
            label="Machine à Laver"
            icon={ShirtFolded}
          />
          <IconOption name="microwave" label="Micro-ondes" icon={Microwave} />
        </div>
      </div>

      {/* Access and Extras */}
      <div
        className="pt-8 border-t border-gray-200 mt-8"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-lg font-medium mb-6"
          style={{ color: "var(--foreground)" }}
        >
          Accès et options supplémentaires
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <IconOption name="entreSeul" label="Entrée Privée" icon={DoorOpen} />
          <IconOption name="garage" label="Garage" icon={Warehouse} />
          <IconOption name="parking" label="Parking" icon={ParkingSquare} />
          <IconOption name="terrasse" label="Terrace" icon={Umbrella} />
          <IconOption
            name="animalAuthorized"
            label="Animal autorisé"
            icon={Dog}
          />
        </div>
      </div>
    </div>
  );
}

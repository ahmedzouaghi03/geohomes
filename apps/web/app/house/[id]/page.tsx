import { getHouseById } from "@/actions/houseActions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { House } from "@/types";
import ContactForm from "@/components/house/ContactForm";
import HouseMapWrapper from "@/components/house/HouseMapWrapper";
import ImageGallery from "@/components/house/ImageGallery";
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
  Calendar,
  CalendarX,
} from "lucide-react";

import {
  FaSwimmingPool as Pool, // Swimming Pool (piscine)
  FaBuilding as Elevator, // Elevator (elevator)
  FaTree as Tree, // Garden types (garden - None/Normal/Gazon)
  FaWindowMaximize as Window, // Double Glazing (doubleVitrage)
} from "react-icons/fa";

export default async function HouseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getHouseById(params.id);
  if (!result.success) return notFound();
  const house = result.data as House;

  // All extras from prisma/types
  const getExtras = () => {
    const extras: string[] = [];
    if (house.options?.piscine) extras.push("Piscine");
    if (house.options?.piedDansEau) extras.push("Pied dans l'eau");
    if (house.options?.elevator) extras.push("Ascenseur");
    if (house.options?.clim) extras.push("Climatisation");
    if (house.options?.internet) extras.push("Internet");
    if (house.options?.garden && house.options.garden !== "NONE")
      extras.push(`Jardin (${house.options.garden})`);
    if (house.options?.heating && house.options.heating !== "NONE")
      extras.push(`Chauffage (${house.options.heating})`);
    if (house.options?.porteBlinde) extras.push("Porte blindée");
    if (house.options?.doubleVitrage) extras.push("Double vitrage");
    if (house.options?.cameraSecurite) extras.push("Caméra sécurité");
    if (house.options?.concierge) extras.push("Concierge");
    if (house.options?.furnished) extras.push("Meublé");
    if (house.options?.kitchenEquipped) extras.push("Cuisine équipée");
    if (house.options?.refrigerator) extras.push("Réfrigérateur");
    if (house.options?.four) extras.push("Four");
    if (house.options?.tv) extras.push("TV");
    if (house.options?.washingMachine) extras.push("Machine à laver");
    if (house.options?.microwave) extras.push("Micro-ondes");
    if (house.options?.entreSeul) extras.push("Entrée privée");
    if (house.options?.garage) extras.push("Garage");
    if (house.options?.parking) extras.push("Parking");
    if (house.options?.terrasse) extras.push("Terrasse");
    if (house.options?.animalAuthorized) extras.push("Animaux autorisés");
    return extras;
  };

  // Icon mapping for extras
  const extrasIconMap: Record<
    string,
    { icon: React.ReactNode; label: string }
  > = {
    piscine: { icon: <Pool size={20} />, label: "Piscine" },
    piedDansEau: { icon: <Waves size={20} />, label: "Pied dans l'eau" },
    elevator: { icon: <Elevator size={20} />, label: "Ascenseur" },
    clim: { icon: <Snowflake size={20} />, label: "Climatisation" },
    internet: { icon: <Wifi size={20} />, label: "Internet" },
    garden: { icon: <Tree size={20} />, label: "Jardin" },
    heating: { icon: <Flame size={20} />, label: "Chauffage" },
    porteBlinde: { icon: <Shield size={20} />, label: "Porte blindée" },
    doubleVitrage: { icon: <Window size={20} />, label: "Double vitrage" },
    cameraSecurite: { icon: <Camera size={20} />, label: "Caméra sécurité" },
    concierge: { icon: <UserRound size={20} />, label: "Concierge" },
    furnished: { icon: <Sofa size={20} />, label: "Meublé" },
    kitchenEquipped: {
      icon: <UtensilsCrossed size={20} />,
      label: "Cuisine équipée",
    },
    refrigerator: { icon: <Refrigerator size={20} />, label: "Réfrigérateur" },
    four: { icon: <Oven size={20} />, label: "Four" },
    tv: { icon: <Tv size={20} />, label: "TV" },
    washingMachine: {
      icon: <ShirtFolded size={20} />,
      label: "Machine à laver",
    },
    microwave: { icon: <Microwave size={20} />, label: "Micro-ondes" },
    entreSeul: { icon: <DoorOpen size={20} />, label: "Entrée privée" },
    garage: { icon: <Warehouse size={20} />, label: "Garage" },
    parking: { icon: <ParkingSquare size={20} />, label: "Parking" },
    terrasse: { icon: <Umbrella size={20} />, label: "Terrasse" },
    animalAuthorized: { icon: <Dog size={20} />, label: "Animaux autorisés" },
  };

  // Helper to get enabled extras as {key, label, icon}
  function getEnabledExtras(options: any) {
    const enabled: { key: string; label: string; icon: React.ReactNode }[] = [];
    for (const key in extrasIconMap) {
      if (
        options[key] &&
        (typeof options[key] === "boolean"
          ? options[key]
          : options[key] !== "NONE")
      ) {
        let label = extrasIconMap[key].label;
        if (key === "garden" && options.garden && options.garden !== "NONE") {
          label = `Jardin (${options.garden})`;
        }
        if (
          key === "heating" &&
          options.heating &&
          options.heating !== "NONE"
        ) {
          label = `Chauffage (${options.heating})`;
        }
        enabled.push({ key, label, icon: extrasIconMap[key].icon });
      }
    }
    return enabled;
  }

  // Format date helper
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get coordinates for map
  const getCoordinates = (): [number, number] | null => {
    if (house.position?.mapPosition) {
      const coords = house.position.mapPosition
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return [coords[0], coords[1]];
      }
    }
    return null;
  };

  // Carousel logic
  const images =
    house.images && house.images.length > 0
      ? house.images
      : ["/placeholder-property.jpg"];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ImageGallery images={images} houseTitle={house.title} />
        {/* Contact Form */}
        <div className="md:col-span-1">
          <ContactForm
            adminEmail={house.admin?.email}
            houseTitle={house.title}
            houseId={house.id}
            adminPhones={house.admin?.phoneNumbers}
            adminName={house.admin?.name}
          />
        </div>
      </div>

      {/* House Info */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">{house.title}</h1>
        <div className="flex flex-wrap gap-4 text-gray-700 mb-2">
          <span>📐 {house.area || "N/A"} m²</span>
          <span>🛏️ {house.rooms} Pièces</span>
          <span>🛌 {house.rooms} Chambres</span>
          <span>🚿 {house.bathrooms} Salles de bains</span>
        </div>
        <div className="text-blue-700 mb-2">
          📍 {house.position?.city?.name || "N/A"},{" "}
          {house.position?.address || "N/A"}
        </div>
      </div>

      {/* Availability Status */}
      {(house.startDate || house.endDate) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CalendarX className="h-5 w-5 text-red-500" />
            Période d'indisponibilité
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">
                Cette propriété n'est pas disponible pendant la période suivante
                :
              </span>
            </div>
            <div className="text-red-700">
              {house.startDate && house.endDate ? (
                <span>
                  Du <strong>{formatDate(house.startDate)}</strong> au{" "}
                  <strong>{formatDate(house.endDate)}</strong>
                </span>
              ) : house.startDate ? (
                <span>
                  À partir du <strong>{formatDate(house.startDate)}</strong>{" "}
                  (date de fin non définie)
                </span>
              ) : (
                <span>
                  Jusqu'au <strong>{formatDate(house.endDate)}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <span className="font-semibold">Description:</span>
        <p>{house.description}</p>
      </div>

      <div className="mb-6">
        <span className="font-semibold">Extras :</span>
        <div className="flex flex-wrap gap-6 mt-2">
          {getEnabledExtras(house.options).length === 0 ? (
            <span>Aucun extra</span>
          ) : (
            getEnabledExtras(house.options).map((extra) => (
              <div
                key={extra.key}
                className="flex items-center gap-2 w-56 text-gray-700"
              >
                <span className="text-blue-700">{extra.icon}</span>
                <span>{extra.label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Localisation</h3>
        {getCoordinates() ? (
          <div className="bg-white rounded-lg border shadow-sm">
            <HouseMapWrapper
              coordinates={getCoordinates()!}
              title={house.title}
              address={`${house.position?.city?.name || "N/A"}, ${
                house.position?.address || "N/A"
              }`}
            />
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-600">
              Localisation sur carte non disponible
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {house.position?.city?.name || "N/A"},{" "}
              {house.position?.address || "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

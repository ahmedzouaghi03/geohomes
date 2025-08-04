"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, HeartIcon, Clock } from "lucide-react";
import { HeartOffIcon as HeartSolidIcon } from "lucide-react";
import WishlistModal from "@/components/house/WishlistModal";
import { House } from "@/types";

interface HouseCardProps {
  house: House;
}

const HouseCard: React.FC<HouseCardProps> = ({ house }) => {
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const images =
    house.images && house.images.length > 0
      ? house.images
      : ["/placeholder-property.jpg"];

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Check if house is occupied
  const isOccupied = () => {
    if (!house.startDate || !house.endDate) return false;
    const now = new Date();
    const startDate = new Date(house.startDate);
    const endDate = new Date(house.endDate);
    return now >= startDate && now <= endDate;
  };

  // Get the end date for occupied houses
  const getAvailabilityDate = () => {
    if (!house.endDate) return null;
    const endDate = new Date(house.endDate);
    return endDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get house category label
  const getCategoryLabel = () => {
    switch (house.category) {
      case "VENTE":
        return "À Vendre";
      case "LOCATION":
        return "À Louer";
      case "LOCATION_VACANCES":
        return "Location Vacances";
      default:
        return "À Louer";
    }
  };

  const handleContactClick = () => {
    // Check if house has admin/owner contact information
    if (house.phoneNumbers && house.phoneNumbers.length > 0) {
      // Create a pre-filled message for the admin
      const message = `Bonjour, je suis intéressé(e) par votre propriété: ${house.title}. 
    
Détails de la propriété:
- Localisation: ${house.position?.city?.name || "N/A"}, ${house.position?.address || "N/A"}
- Surface: ${house.area || "N/A"} m²
- Chambres: ${house.bathrooms}
- Pièces: ${house.rooms}

Pourriez-vous me donner plus d'informations s'il vous plaît?

Merci!`;

      // Open WhatsApp with pre-filled message
      window.open(
        `https://wa.me/${house.phoneNumbers[0]}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else if (house.admin?.email) {
      // Fallback to email if no phone number is available
      const subject = `Demande d'information - ${house.title}`;
      const body = `Bonjour,

Je suis intéressé(e) par votre propriété: ${house.title}

Détails de la propriété:
- Localisation: ${house.position?.city?.name || "N/A"}, ${house.position?.address || "N/A"}
- Surface: ${house.area || "N/A"} m²
- Chambres: ${house.bathrooms}
- Pièces: ${house.rooms}

Pourriez-vous me donner plus d'informations s'il vous plaît?

Merci!`;

      window.location.href = `mailto:${house.admin?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      // No contact information available
      alert("Aucune information de contact disponible pour cette propriété.");
    }
  };

  const getExtras = () => {
    const extras: string[] = [];
    if (house.options?.terrasse) extras.push("Terrasse");
    if (house.options?.garage) extras.push("Garage");
    if (house.options?.elevator) extras.push("Ascenseur");
    if (house.options?.furnished || house.options?.furnished)
      extras.push("Meublé");
    if (house.options?.clim) extras.push("Climatisation");
    if (house.options?.piscine) extras.push("Piscine");
    if (house.options?.piedDansEau) extras.push("Pied dans l'eau");
    if (house.options?.internet) extras.push("Internet");
    if (house.options?.garden && house.options.garden !== "NONE")
      extras.push("Jardin");
    if (house.options?.heating && house.options.heating !== "NONE")
      extras.push("Chauffage");
    if (house.options?.porteBlinde) extras.push("Porte blindée");
    if (house.options?.doubleVitrage) extras.push("Double vitrage");
    if (house.options?.cameraSecurite) extras.push("Caméra sécurité");
    if (house.options?.concierge) extras.push("Concierge");
    if (house.options?.kitchenEquipped) extras.push("Cuisine équipée");
    if (house.options?.refrigerator) extras.push("Réfrigérateur");
    if (house.options?.four) extras.push("Four");
    if (house.options?.tv) extras.push("TV");
    if (house.options?.washingMachine) extras.push("Machine à laver");
    if (house.options?.microwave) extras.push("Micro-ondes");
    if (house.options?.entreSeul) extras.push("Entrée privée");
    if (house.options?.parking) extras.push("Parking");
    if (house.options?.animalAuthorized) extras.push("Animaux autorisés");
    return extras;
  };

  const extras = getExtras();
  const displayedExtras = extras.slice(0, 3);
  const remainingExtras = extras.length - displayedExtras.length;

  const handleCallClick = () => {
    if (house.phoneNumbers && house.phoneNumbers.length > 0) {
      window.location.href = `tel:${house.phoneNumbers[0]}`;
    }
  };

  const handleWhatsAppClick = () => {
    if (house.phoneNumbers && house.phoneNumbers.length > 0) {
      const message = `Bonjour, je suis intéressé(e) par votre propriété: ${house.title}. 
    
Détails de la propriété:
- Localisation: ${house.position?.city?.name || "N/A"}, ${house.position?.address || "N/A"}
- Surface: ${house.area || "N/A"} m²
- Chambres: ${house.bathrooms}
- Pièces: ${house.rooms}
- Extras: ${extras.join(", ") || "Aucun"}

Pourriez-vous me donner plus d'informations s'il vous plaît?

Merci!`;
      window.open(
        `https://wa.me/${house.phoneNumbers[0]}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    }
  };

  const handleWishlistClick = () => {
    setShowWishlistModal(true);
  };

  // Format price for display
  const formatPrice = (price?: number) => {
    if (!price) return "-";
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Function to display price range or single price
  const displayPrice = () => {
    if (house.prixMin && house.prixMax) {
      if (house.prixMin === house.prixMax) {
        return formatPrice(house.prixMin);
      }
      return `${formatPrice(house.prixMin)} - ${formatPrice(house.prixMax)}`;
    } else if (house.prixMin) {
      return `${formatPrice(house.prixMin)}`;
    } else if (house.prixMax) {
      return `${formatPrice(house.prixMax)}`;
    }
    return "Prix sur demande";
  };

  // Map house type to French
  const houseTypeMap: Record<string, string> = {
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    VILLA: "Villa",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* Image carousel */}
      <div className="relative w-full h-56">
        <Link href={`/house/${house.id}`}>
          <Image
            src={images[imgIdx]}
            alt={house.title}
            fill
            className="object-cover"
          />
        </Link>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Occupancy Status Badge */}
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          {isOccupied() && (
            <div className="px-3 py-1 bg-orange-500 text-white rounded-md font-bold text-sm">
              Occupée
            </div>
          )}
          <div className="px-3 py-1 bg-blue-500 text-white rounded-md font-bold text-sm">
            {getCategoryLabel()}
          </div>
        </div>

        {/* Wishlist button */}
        <div className="absolute hidden top-4 right-4 z-10">
          <button
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            onClick={() => setShowWishlistModal(true)}
          >
            {isWishlisted ? (
              <HeartSolidIcon className="w-6 h-6 text-red-500" />
            ) : (
              <HeartIcon className="w-6 h-6 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* House details */}
      <div className="p-2 flex flex-col flex-1">
        <h2 className="text-lg font-bold mb-2">
          <Link href={`/house/${house.id}`}>{house.title}</Link>
        </h2>

        <div className="flex items-center text-sm mb-2 text-blue-700">
          <span>
            📍 {house.position?.city?.name || "N/A"},{" "}
            {house.position?.address || "N/A"}
          </span>
        </div>

        {/* Property details */}
        <div
          className={`flex-wrap gap-4 text-sm mb-2 ${
            house.category === "VENTE" ? "flex" : "hidden"
          }`}
        >
          {/*nzid flex ki ena7i hidden*/}
          <span>📐 {house.area || "N/A"} m²</span>
          <span>🛏️ {house.rooms} Pièces</span>
          <span>🛌 {house.bathrooms} Chambres</span>
        </div>

        <div className="flex-wrap gap-4 text-sm mb-2 hidden">
          {/*nzid flex ki ena7i hidden*/}
          <span>🚿 {house.bathrooms} Salles de bains</span>
        </div>

        {/* Availability status text */}
        {isOccupied() && (
          <div className="mb-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
            <div className="flex items-center gap-1 text-orange-700">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                Disponible à partir du {getAvailabilityDate()}
              </span>
            </div>
          </div>
        )}

        {/* Extras */}
        <div className="flex-wrap gap-2 text-sm mb-2 hidden">
          {/*ki ena7i hidden nzid flex*/}
          {displayedExtras.map((extra, idx) => (
            <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
              {extra}
            </span>
          ))}
          {remainingExtras > 0 && (
            <span className="bg-gray-200 px-2 py-1 rounded">
              + {remainingExtras} extras
            </span>
          )}
        </div>

        {/* House type */}
        <div className="mt-4">
          <div className="badge bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800 w-max mx-auto">
            {houseTypeMap[house.type] || house.type}
          </div>
        </div>
      </div>

      {/* Contact buttons - modify based on availability */}
      <div className="flex gap-2 p-4 mt-auto">
        {isOccupied() ? (
          <div className="flex-1 flex items-center justify-center px-2 py-2 bg-gray-300 rounded-md text-sm text-gray-600 cursor-not-allowed">
            <Clock className="h-4 w-4 mr-1" />
            Occupé jusqu'au {getAvailabilityDate()}
          </div>
        ) : (
          <>
            <button
              onClick={handleContactClick}
              className="flex-1 flex items-center justify-center px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contacter
            </button>
            <button
              onClick={handleCallClick}
              className="flex-1 flex items-center justify-center px-2 py-2 bg-green-500 hover:bg-green-600 rounded-md text-sm text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Appeler
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 flex items-center justify-center px-2 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm text-white"
            >
              <svg
                className="h-4 w-4 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.6 6.32c1.59 1.59 2.4 3.74 2.4 5.68 0 4.42-3.58 8-8 8-1.6 0-3.1-.47-4.35-1.27l-5.65 2.37 2.43-5.66A7.93 7.93 0 0 1 4 12c0-4.42 3.58-8 8-8 1.94 0 4.09.81 5.68 2.4l-.08-.08zm-5.6 13.68c3.87 0 7-3.13 7-7s-3.13-7-7-7-7 3.13-7 7c0 1.47.45 2.83 1.22 3.95l-1.3 3.04 3.13-1.3A6.957 6.957 0 0 0 12 20z" />
              </svg>
              WhatsApp
            </button>
          </>
        )}
      </div>

      {/* Wishlist Modal */}
      {showWishlistModal && (
        <WishlistModal
          isOpen={showWishlistModal}
          onRequestClose={() => setShowWishlistModal(false)}
          houseId={house.id}
        />
      )}
    </div>
  );
};

export default HouseCard;

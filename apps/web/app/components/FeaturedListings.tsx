"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HouseCategory, House } from "@/types";
import { Clock } from "lucide-react";

interface Props {
  listings: House[];
  totalCounts: Record<HouseCategory, number>;
  initialCategory: HouseCategory;
}

const categoryLabels: Record<HouseCategory, string> = {
  VENTE: "VENTE",
  LOCATION: "LOCATION",
  LOCATION_VACANCES: "LOCATION VACANCES",
};

export default function FeaturedListings({
  listings,
  totalCounts,
  initialCategory,
}: Props) {
  const [selectedCategory, setSelectedCategory] =
    useState<HouseCategory>(initialCategory);

  // Filter listings by selected category
  const filteredListings = listings.filter(
    (l) => l.category === selectedCategory
  );

  // Check if house is occupied
  const isOccupied = (house: House) => {
    if (!house.startDate || !house.endDate) return false;
    const now = new Date();
    const startDate = new Date(house.startDate);
    const endDate = new Date(house.endDate);
    return now >= startDate && now <= endDate;
  };

  // Get the end date for occupied houses
  const getAvailabilityDate = (house: House) => {
    if (!house.endDate) return null;
    const endDate = new Date(house.endDate);
    return endDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get house category label
  const getCategoryLabel = (category: HouseCategory) => {
    switch (category) {
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

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {totalCounts[selectedCategory]?.toLocaleString("fr-FR") ?? 0} biens
          immobiliers
        </h2>
        <div className="flex space-x-4">
          {Object.values(HouseCategory).map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-md cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#3A5FCD] text-white hover:bg-[#193997]"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.slice(0, 6).map((listing) => (
          <Link
            key={listing.id}
            href={`/house/${listing.id}`}
            className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={listing.images[0] || "/placeholder-property.jpg"}
                alt={listing.title}
                fill
                className="object-cover"
              />

              {/* Top badges container */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {/* Occupancy Status Badge */}
                {isOccupied(listing) && (
                  <div className="px-3 py-1 bg-orange-500 text-white rounded-md font-bold text-sm">
                    Occupée
                  </div>
                )}
                <div className="px-3 py-1 bg-blue-500 text-white rounded-md font-bold text-sm">
                  {getCategoryLabel(listing.category)}
                </div>
              </div>

              {/* House state badge (NOUVEAU) */}
              {listing.state === "NOUVEAU" && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                  NEUF
                </div>
              )}

              {/* Price overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-bold text-lg">
                  {listing.prixMin
                    ? `${listing.prixMin.toLocaleString("fr-FR")} TND`
                    : "Prix sur demande"}
                </p>
                <p className="text-white text-sm">
                  {listing.type} • {listing.position?.city?.name ?? ""}
                </p>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{listing.title}</h3>

              {/* Availability status text for occupied houses */}
              {isOccupied(listing) && (
                <div className="mb-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                  <div className="flex items-center gap-1 text-orange-700">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      Disponible le {getAvailabilityDate(listing)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-600">
                {listing.rooms && (
                  <span>
                    {listing.rooms} {listing.rooms > 1 ? "Chambres" : "Chambre"}
                  </span>
                )}
                {listing.bathrooms && (
                  <span>
                    {listing.bathrooms}{" "}
                    {listing.bathrooms > 1 ? "Salles de bain" : "Salle de bain"}
                  </span>
                )}
                <span>{listing.area ? `${listing.area} m²` : ""}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={`/house?category=${selectedCategory}`}
          className="px-6 py-3 border border-[#3A5FCD] text-[#3A5FCD] rounded-md hover:bg-orange-50 inline-block"
        >
          Voir plus d&apos;annonces
        </Link>
      </div>
    </section>
  );
}

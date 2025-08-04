"use client";
import { useState } from "react";
import { HouseCategory, House } from "@/types";
import HouseCard from "@/components/house/HouseCard";
import Link from "next/link";

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

  // Filter listings by selected category and exclude deleted houses
  const filteredListings = listings.filter(
    (l) => l.category === selectedCategory && !l.isDeleted
  );

  return (
    <section className="mb-12">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col space-y-4 mb-6 md:flex-row md:justify-between md:items-center md:space-y-0">
        <h2 className="text-2xl font-bold">
          {totalCounts[selectedCategory]?.toLocaleString("fr-FR") ?? 0} biens
          immobiliers
        </h2>

        {/* Responsive button container */}
        <div className="flex flex-wrap gap-2 md:gap-4">
          {Object.values(HouseCategory).map((cat) => (
            <button
              key={cat}
              className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors md:px-4 md:text-base ${
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

      {/* Use HouseCard component instead of custom card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.slice(0, 6).map((listing) => (
          <HouseCard key={listing.id} house={listing} />
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

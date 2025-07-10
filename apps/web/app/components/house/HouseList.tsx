"use client";

import { useState, useEffect } from "react";
import Filters from "@/components/house/Filters";
import HouseCard from "@/components/house/HouseCard";
import Pagination from "@/components/house/Pagination";
import { House, HouseCategory, HouseType } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

interface HouseListProps {
  initialHouses: House[];
  totalPages: number;
  currentPage: number;
  cities: { id: string; name: string }[];
  // Replace searchParams with specific filter properties
  category?: HouseCategory;
  type?: HouseType;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  cityId?: string;
  minArea?: number;
  startDate?: string;
  endDate?: string;
}

export default function HouseList({
  initialHouses,
  totalPages,
  currentPage,
  cities,
  category,
  type,
  minPrice,
  maxPrice,
  rooms,
  cityId,
  minArea,
  startDate,
  endDate,
}: HouseListProps) {
  const [houses, setHouses] = useState<House[]>(initialHouses);
  const [showFilters, setShowFilters] = useState(false); // <-- Add this state

  // Update houses when props change
  useEffect(() => {
    setHouses(initialHouses);
  }, [initialHouses]);

  // Create filter props to pass to Filters component
  const filterProps = {
    category,
    type,
    minPrice: minPrice?.toString(),
    maxPrice: maxPrice?.toString(),
    rooms: rooms?.toString(),
    cityId,
    minArea: minArea?.toString(),
    startDate,
    endDate,
  };

  if (houses.length === 0) {
    return (
      <div>
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setShowFilters(true)}
        >
          Filtres
        </button>
        {showFilters && (
          <AnimatePresence>
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Filters cities={cities} initialFilters={filterProps} />
              <button
                className="mt-2 px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowFilters(false)}
              >
                Fermer les filtres
              </button>
            </motion.div>
          </AnimatePresence>
        )}

        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <h2 className="text-xl font-semibold mb-4">Aucune annonce trouvée</h2>
          <p className="text-gray-600 mb-6">
            Aucun bien immobilier ne correspond à vos critères de recherche.
          </p>
          <p className="text-gray-600">
            Essayez de modifier vos filtres ou de revenir à la recherche par
            défaut.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setShowFilters(true)}
      >
        Filtres
      </button>
      {showFilters && (
        <AnimatePresence>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Filters cities={cities} initialFilters={filterProps} />
            <button
              className="mt-2 px-4 py-2 bg-gray-200 rounded"
              onClick={() => setShowFilters(false)}
            >
              Fermer les filtres
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="my-6">
        <p className="text-gray-600">{houses.length} résultat(s) trouvé(s)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house) => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

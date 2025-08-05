import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import PropertyTypes from "@/components/PropertyTypes";
import FeaturedListings from "@/components/FeaturedListings";
import PopularCities from "@/components/PopularCities";
import Footer from "@/components/Footer";
import { db } from "@monkeyprint/db";
import {
  HouseCategory,
  HouseType,
  Governorat,
  Emplacement,
  HouseState,
  SolType,
  House,
  City,
  HeatingType,
  GardenType,
  LocationType,
} from "@/types";
import { Metadata } from "next";

import { clearExpiredHouseDates } from "@/actions/houseActions";

// Server-side data fetching for the home page
async function getHomePageData() {
  // Clear expired house dates first
  try {
    const result = await clearExpiredHouseDates();
    if (result.success && result.count && result.count > 0) {
      console.log(`Cleared ${result.count} expired house dates`);
    }
  } catch (error) {
    console.error("Error clearing expired dates:", error);
  }
  // Fetch all cities for search filter
  const citiesRaw = await db.city.findMany({ orderBy: { name: "asc" } });
  const cities: City[] = citiesRaw.map((city) => ({
    ...city,
    governorat: city.governorat as Governorat, // Cast to enum
  }));

  // Fetch property type counts
  const typeCounts = await Promise.all(
    Object.values(HouseType).map(async (type) => ({
      type,
      count: await db.house.count({
        where: { type, isDeleted: false },
      }),
    }))
  );

  // Fetch featured listings (latest 12 houses, with city relation)
  const listingsRaw = await db.house.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      position: { include: { city: true } },
      options: true,
      admin: true,
    },
  });

  // Map listings to match the House interface (convert nulls to undefined, cast enums)
  const listings: House[] = listingsRaw.map((house) => ({
    ...house,
    category: house.category as HouseCategory,
    type: house.type as HouseType,
    emplacement: house.emplacement as Emplacement | undefined,
    state: house.state as HouseState | undefined,
    solType: house.solType as SolType | undefined,
    locationType: house.locationType as LocationType | undefined,
    description: house.description ?? undefined,
    area: house.area ?? undefined,
    prixMin: house.prixMin ?? undefined,
    prixMax: house.prixMax ?? undefined,
    floors: house.floors ?? undefined,
    startDate: house.startDate ?? undefined,
    endDate: house.endDate ?? undefined,
    position: house.position
      ? {
          ...house.position,
          address: house.position.address ?? undefined,
          mapPosition: house.position.mapPosition ?? undefined,
          governorat: house.position.governorat as Governorat,
          cityId: house.position.cityId,
          city: house.position.city
            ? {
                ...house.position.city,
                governorat: house.position.city.governorat as Governorat,
              }
            : undefined,
        }
      : undefined,
    options: house.options
      ? {
          ...house.options,
          garden: house.options.garden as GardenType,
          heating: house.options.heating as HeatingType,
        }
      : undefined,
    admin: house.admin ?? undefined,
  }));

  // Fetch total counts per category
  const totalCounts: Record<HouseCategory, number> = {
    VENTE: await db.house.count({
      where: { category: HouseCategory.VENTE, isDeleted: false },
    }),
    LOCATION: await db.house.count({
      where: { category: HouseCategory.LOCATION, isDeleted: false },
    }),
    LOCATION_VACANCES: await db.house.count({
      where: { category: HouseCategory.LOCATION_VACANCES, isDeleted: false },
    }),
  };

  // Fetch top 5 popular cities by house count
  const cityStats = await db.house.groupBy({
    by: ["positionId"],
    where: { isDeleted: false },
    _count: { _all: true },
  });

  // Map positionId to cityId
  const positions = await db.housePosition.findMany({
    where: { id: { in: cityStats.map((c) => c.positionId) } },
    include: { city: true },
  });

  // Aggregate city counts
  const cityCountMap: Record<
    string,
    { id: string; name: string; count: number }
  > = {};
  for (const stat of cityStats) {
    const pos = positions.find((p) => p.id === stat.positionId);
    if (pos && pos.city) {
      if (!cityCountMap[pos.city.id]) {
        cityCountMap[pos.city.id] = {
          id: pos.city.id,
          name: pos.city.name,
          count: 0,
        };
      }
      cityCountMap[pos.city.id].count += stat._count._all;
    }
  }
  const popularCities = Object.values(cityCountMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    cities,
    typeCounts,
    listings,
    totalCounts,
    popularCities,
  };
}

export default async function Home() {
  const { cities, typeCounts, listings, totalCounts, popularCities } =
    await getHomePageData();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="hidden lg:block">
          <SearchSection cities={cities} />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="hidden lg:block">
            <PropertyTypes typeCounts={typeCounts} />
          </div>

          <FeaturedListings
            listings={listings}
            totalCounts={totalCounts}
            initialCategory={HouseCategory.LOCATION_VACANCES}
          />
          <PopularCities cities={popularCities} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Location Maison Sousse | Vente Appartement Sousse - Sousse Planner",
  description:
    "🏠 Trouvez votre maison ou appartement à Sousse. +200 propriétés disponibles. Location, vente, location vacances. Meilleurs prix garantis!",
  keywords:
    "location maison sousse, vente appartement sousse, immobilier sousse, location vacances sousse, maison à louer sousse, appartement vente sousse",
  alternates: {
    canonical: "https://sousseplanner.com",
  },
  openGraph: {
    title: "Location Maison Sousse | Vente Appartement Sousse",
    description:
      "Découvrez +200 propriétés à Sousse. Location, vente, vacances.",
    url: "https://sousseplanner.com",
    images: ["/images/sousse1.jpg"],
  },
};

import { Suspense } from "react";
import { db } from "@monkeyprint/db";
import HouseList from "@/components/house/HouseList";
import { getHouses } from "@/actions/houseActions";
import { House, HouseCategory, HouseType } from "@/types";

export const dynamic = "force-dynamic";

interface SearchParams {
  [key: string]: string | string[] | undefined;
  page?: string;
  category?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  rooms?: string;
  cityId?: string;
  minArea?: string;
  startDate?: string;
  endDate?: string;
}

async function getCities() {
  try {
    const cities = await db.city.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return cities;
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return [];
  }
}

export default async function HousePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  // Parse search parameters
  const page = params.page ? parseInt(params.page as string) : 1;
  const category = params.category as HouseCategory | undefined;
  const type = params.type as HouseType | undefined;
  const minPrice = params.minPrice
    ? parseFloat(params.minPrice as string)
    : undefined;
  const maxPrice = params.maxPrice
    ? parseFloat(params.maxPrice as string)
    : undefined;
  const rooms = params.rooms ? parseInt(params.rooms as string) : undefined;
  const cityId = params.cityId as string | undefined;
  const minArea = params.minArea
    ? parseInt(params.minArea as string)
    : undefined;
  const startDate = params.startDate as string | undefined;
  const endDate = params.endDate as string | undefined;

  // Fetch cities for the filter
  const cities = await getCities();

  // Fetch houses data with filters
  const result = await getHouses({
    page,
    limit: 10,
    category,
    type,
    minPrice,
    maxPrice,
    rooms,
    cityId,
    ...(minArea && { minArea }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  });

  // Handle the data safely with type assertion
  const houses = result.success ? (result.data as House[]) : [];
  const totalPages =
    result.success && result.pagination ? result.pagination.totalPages : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Annonces Immobilières
        {category === "VENTE"
          ? " - À Vendre"
          : category === "LOCATION"
            ? " - À Louer"
            : category === "LOCATION_VACANCES"
              ? " - Locations Vacances"
              : ""}
      </h1>

      <Suspense fallback={<div>Loading cities...</div>}>
        <HouseList
          initialHouses={houses}
          totalPages={totalPages}
          currentPage={page}
          cities={cities}
          minPrice={minPrice}
          maxPrice={maxPrice}
          rooms={rooms}
          cityId={cityId}
          minArea={minArea}
          startDate={startDate}
          endDate={endDate}
        />
      </Suspense>
    </div>
  );
}

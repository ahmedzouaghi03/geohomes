"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HouseCategory, HouseType, Governorat, City } from "@/types";

interface Props {
  cities: City[];
}

export default function SearchSection({ cities }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState<HouseCategory | "">("");
  const [type, setType] = useState<HouseType | "">("");
  const [cityId, setCityId] = useState<string | "">("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (type) params.append("type", type);
    if (cityId) params.append("cityId", cityId);
    router.push(`/house?${params.toString()}`);
  };

  return (
    <section className="bg-[#3A5FCD] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-6">
          Find Your Dream House in Sousse
        </h1>
        <form
          className="bg-white p-4 rounded-lg shadow-lg"
          onSubmit={handleSearch}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="flex-grow p-3 border rounded-md"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as HouseCategory | "")
              }
            >
              <option value="">For Sale or Rent</option>
              <option value={HouseCategory.VENTE}>For Sale</option>
              <option value={HouseCategory.LOCATION}>For Rent</option>
              <option value={HouseCategory.LOCATION_VACANCES}>
                For Vacation
              </option>
            </select>

            <select
              className="flex-grow p-3 border rounded-md"
              value={type}
              onChange={(e) => setType(e.target.value as HouseType | "")}
            >
              <option value="">All Property Types</option>
              <option value={HouseType.APPARTEMENT}>Apartments</option>
              <option value={HouseType.MAISON}>Maison</option>
              <option value={HouseType.VILLA}>Villas</option>
            </select>

            <select
              className="flex-grow p-3 border rounded-md"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-[#3A5FCD] text-white p-3 rounded-md hover:bg-[#193997] cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

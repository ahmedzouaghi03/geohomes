"use client";
import { useRouter } from "next/navigation";
import { HouseType } from "@/types";

interface Props {
  typeCounts: { type: HouseType; count: number }[];
}

const typeIcons: Record<HouseType, string> = {
  APPARTEMENT: "🏢",
  MAISON: "🏡",
  VILLA: "🏖️",
};

const typeLabels: Record<HouseType, string> = {
  APPARTEMENT: "Appartements",
  MAISON: "Maisons",
  VILLA: "Villas",
};

export default function PropertyTypes({ typeCounts }: Props) {
  const router = useRouter();

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Browse by Property Type</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {typeCounts.map((type) => (
          <div
            key={type.type}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center"
            onClick={() =>
              router.push(`/house?type=${encodeURIComponent(type.type)}`)
            }
          >
            <div className="text-3xl mb-2">{typeIcons[type.type]}</div>
            <h3 className="font-medium">{typeLabels[type.type]}</h3>
            <p className="text-gray-500 text-sm">{type.count} properties</p>
          </div>
        ))}
      </div>
    </section>
  );
}

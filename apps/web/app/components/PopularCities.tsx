import Link from "next/link";

interface CityStat {
  id: string;
  name: string;
  count: number;
}

interface Props {
  cities: CityStat[];
}

export default function PopularCities({ cities }: Props) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Popular Cities</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cities.map((city) => (
          <Link
            key={city.id}
            href={`/house?cityId=${city.id}`}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
          >
            <h3 className="font-medium">{city.name}</h3>
            <p className="text-gray-500 text-sm">{city.count} properties</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

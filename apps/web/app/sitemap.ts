import { MetadataRoute } from "next";
import { db } from "@monkeyprint/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sousseplanner.com";

  // Get all active houses
  const houses = await db.house.findMany({
    where: { isDeleted: false },
    select: { id: true, updatedAt: true },
  });

  // Get all cities
  const cities = await db.city.findMany();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/house`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.8,
    },
  ];

  const housePages = houses.map((house) => ({
    url: `${baseUrl}/house/${house.id}`,
    lastModified: house.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/house?city=${city.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...housePages, ...cityPages];
}

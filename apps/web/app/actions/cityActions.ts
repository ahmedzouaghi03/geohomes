"use server";

import { db } from "@monkeyprint/db";
import { City, ApiResponse, Governorat } from "@/types";

export async function getCities(): Promise<ApiResponse<City[]>> {
  try {
    const cities = await db.city.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: cities.map((city) => ({
        id: city.id,
        name: city.name,
        governorat: city.governorat as Governorat,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch cities",
    };
  }
}

export async function addCity(
  name: string,
  governorat: Governorat
): Promise<ApiResponse<City>> {
  try {
    // Check if city already exists
    const existingCity = await db.city.findFirst({
      where: {
        name,
        governorat,
      },
    });

    if (existingCity) {
      return {
        success: false,
        error: "City with this name and governorate already exists",
      };
    }

    // Create the city
    const city = await db.city.create({
      data: {
        name,
        governorat,
      },
    });

    return {
      success: true,
      data: {
        id: city.id,
        name: city.name,
        governorat: city.governorat as Governorat,
      },
    };
  } catch (error) {
    console.error("Failed to add city:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add city",
    };
  }
}

export async function deleteCity(id: string): Promise<ApiResponse<void>> {
  try {
    // Check if city is being used by any house positions
    const housePositionsCount = await db.housePosition.count({
      where: { cityId: id },
    });

    if (housePositionsCount > 0) {
      return {
        success: false,
        error:
          "Cannot delete city as it is associated with one or more properties",
      };
    }

    // Delete the city
    await db.city.delete({
      where: { id },
    });

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("Failed to delete city:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete city",
    };
  }
}

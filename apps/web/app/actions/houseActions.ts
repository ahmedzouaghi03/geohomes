"use server";

import { db } from "@monkeyprint/db";
import { revalidatePath } from "next/cache";
import {
  CreateHouseData,
  UpdateHouseData,
  HouseCategory,
  HouseType,
  Governorat,
  HeatingType,
  GardenType,
} from "@/types";

export async function createHouse(data: CreateHouseData) {
  try {
    // Ensure numeric fields are actually numbers
    const numericData = {
      ...data,
      area: data.area ? Number(data.area) : undefined,
      rooms: Number(data.rooms),
      bathrooms: Number(data.bathrooms),
      toilets: Number(data.toilets),
      floors: data.floors ? Number(data.floors) : undefined,
      prixMin: data.prixMin ? Number(data.prixMin) : undefined,
      prixMax: data.prixMax ? Number(data.prixMax) : undefined,
    };

    // First create the position
    const position = await db.housePosition.create({
      data: {
        address: numericData.position.address,
        mapPosition: numericData.position.mapPosition,
        governorat: numericData.position.governorat,
        cityId: numericData.position.cityId,
      },
    });

    // Then create the options
    const options = await db.houseOptions.create({
      data: {
        // Swimming and Comfort
        piscine: data.options.piscine ?? false,
        piedDansEau: data.options.piedDansEau ?? false,
        elevator: data.options.elevator ?? false,
        clim: data.options.clim ?? false,
        internet: data.options.internet ?? false,

        // Type Enums
        garden: data.options.garden ?? GardenType.NONE,
        heating: data.options.heating ?? HeatingType.NONE,

        // Security
        porteBlinde: data.options.porteBlinde ?? false,
        doubleVitrage: data.options.doubleVitrage ?? false,
        cameraSecurite: data.options.cameraSecurite ?? false,
        concierge: data.options.concierge ?? true,

        // Furnishing
        furnished: data.options.furnished ?? true,
        kitchenEquipped: data.options.kitchenEquipped ?? true,
        refrigerator: data.options.refrigerator ?? false,
        four: data.options.four ?? false,
        tv: data.options.tv ?? false,
        washingMachine: data.options.washingMachine ?? false,
        microwave: data.options.microwave ?? false,

        // Access and Extras
        entreSeul: data.options.entreSeul ?? true,
        garage: data.options.garage ?? false,
        parking: data.options.parking ?? false,
        terrasse: data.options.terrasse ?? false,
        animalAuthorized: data.options.animalAuthorized ?? false,
      },
    });

    // Now create the house with references to position and options
    const house = await db.house.create({
      data: {
        // Basic house details
        title: data.title,
        description: data.description,
        area: numericData.area,
        rooms: numericData.rooms,
        bathrooms: numericData.bathrooms,
        toilets: numericData.toilets,
        floors: numericData.floors,

        category: data.category,
        type: data.type,
        emplacement: data.emplacement,
        state: data.state,
        solType: data.solType,

        images: data.images,
        prixMin: data.prixMin,
        prixMax: data.prixMax,

        startDate: data.startDate,
        endDate: data.endDate,

        phoneNumbers: data.phoneNumbers,

        // Admin reference
        adminId: data.adminId,

        // Connect to the created position and options
        positionId: position.id,
        optionsId: options.id,
      },
      include: {
        position: {
          include: {
            city: true,
          },
        },
        options: true,
      },
    });

    revalidatePath("/houses");
    return { success: true, data: house };
  } catch (error) {
    console.error("Failed to create house:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create house",
    };
  }
}

//Get all houses with optional filtering and pagination
export async function getHouses({
  page = 1,
  limit = 10,
  category,
  type,
  minPrice,
  maxPrice,
  rooms,
  adminId,
  cityId,
  governorat,
  minArea,
  startDate,
  endDate,
}: {
  page?: number;
  limit?: number;
  category?: HouseCategory;
  type?: HouseType;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  adminId?: string;
  cityId?: string;
  governorat?: Governorat;
  minArea?: number;
  startDate?: string;
  endDate?: string;
} = {}) {
  try {
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: any = {
      isDeleted: false,
    };

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (minPrice !== undefined) {
      where.prixMin = { gte: minPrice };
    }

    if (maxPrice !== undefined) {
      where.prixMax = { lte: maxPrice };
    }

    if (rooms) {
      where.rooms = rooms;
    }

    if (adminId) {
      where.adminId = adminId;
    }

    // Filter by minimum area
    if (minArea !== undefined) {
      where.OR = where.OR || [];
      where.OR.push({ area: { gte: minArea } }, { area: null });
    }

    // Filter by position
    if (cityId || governorat) {
      where.position = {};

      if (cityId) {
        where.position.cityId = cityId;
      }

      if (governorat) {
        where.position.governorat = governorat;
      }
    }

    // Date filtering logic - exclude houses with overlapping dates
    if (startDate || endDate) {
      const filterStartDate = startDate ? new Date(startDate) : null;
      const filterEndDate = endDate ? new Date(endDate) : null;

      // Add to your existing where clause:
      where.AND = where.AND || [];

      // Exclude houses that have overlapping dates
      where.AND.push({
        OR: [
          // Houses with no dates (always available)
          { AND: [{ startDate: null }, { endDate: null }] },

          // Houses where both filter dates are provided
          ...(filterStartDate && filterEndDate
            ? [
                // House ends before filter starts
                { endDate: { lt: filterStartDate } },
                // House starts after filter ends
                { startDate: { gt: filterEndDate } },
              ]
            : []),

          // Houses where only filter start date is provided
          ...(filterStartDate && !filterEndDate
            ? [
                // House ends before filter starts
                { endDate: { lt: filterStartDate } },
                // House has no end date but starts after filter
                {
                  AND: [
                    { endDate: null },
                    { startDate: { gt: filterStartDate } },
                  ],
                },
              ]
            : []),

          // Houses where only filter end date is provided
          ...(!filterStartDate && filterEndDate
            ? [
                // House starts after filter ends
                { startDate: { gt: filterEndDate } },
                // House has no start date but ends before filter
                {
                  AND: [
                    { startDate: null },
                    { endDate: { lt: filterEndDate } },
                  ],
                },
              ]
            : []),
        ],
      });
    }

    // Get houses and total count in parallel
    const [houses, totalCount] = await Promise.all([
      db.house.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          position: {
            include: {
              city: true,
            },
          },
          options: true,
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              phoneNumbers: true,
            },
          },
        },
      }),
      db.house.count({ where }),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: houses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  } catch (error) {
    console.error("Failed to fetch houses:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch houses",
    };
  }
}

//Get a single house by ID

export async function getHouseById(id: string) {
  try {
    const house = await db.house.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        position: {
          include: {
            city: true,
          },
        },
        options: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phoneNumbers: true,
          },
        },
        favorites: true,
      },
    });

    if (!house) {
      return { success: false, error: "House not found" };
    }

    return { success: true, data: house };
  } catch (error) {
    console.error(`Failed to fetch house with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch house",
    };
  }
}

//Update an existing house
export async function updateHouse(data: UpdateHouseData) {
  try {
    const { id, position, options, ...houseData } = data;

    // Check if house exists
    const existingHouse = await db.house.findUnique({
      where: { id },
      include: {
        position: true,
        options: true,
      },
    });

    if (!existingHouse) {
      return { success: false, error: "House not found" };
    }

    // Update position if provided
    if (position && existingHouse.position) {
      await db.housePosition.update({
        where: { id: existingHouse.position.id },
        data: position,
      });
    }

    // Update options if provided
    if (options && existingHouse.options) {
      await db.houseOptions.update({
        where: { id: existingHouse.options.id },
        data: options,
      });
    }

    // Update the house itself
    const house = await db.house.update({
      where: { id },
      data: houseData,
      include: {
        position: {
          include: {
            city: true,
          },
        },
        options: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phoneNumbers: true,
          },
        },
      },
    });

    revalidatePath(`/houses/${id}`);
    revalidatePath("/houses");

    return { success: true, data: house };
  } catch (error) {
    console.error(`Failed to update house with ID ${data.id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update house",
    };
  }
}

//Soft delete a house (mark as deleted)
export async function deleteHouse(id: string) {
  try {
    // First check if house exists
    const house = await db.house.findUnique({
      where: { id },
    });

    if (!house) {
      return { success: false, error: "House not found" };
    }

    // Soft delete the house (mark as deleted)
    await db.house.update({
      where: { id },
      data: { isDeleted: true },
    });

    revalidatePath("/houses");

    return { success: true };
  } catch (error) {
    console.error(`Failed to delete house with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete house",
    };
  }
}

// Hard delete a house (completely remove from database)
export async function hardDeleteHouse(id: string) {
  try {
    // First check if house exists
    const house = await db.house.findUnique({
      where: { id },
      include: {
        position: true,
        options: true,
      },
    });

    if (!house) {
      return { success: false, error: "House not found" };
    }

    // Delete the house (cascades to position and options)
    await db.house.delete({
      where: { id },
    });

    revalidatePath("/houses");

    return { success: true };
  } catch (error) {
    console.error(`Failed to hard delete house with ID ${id}:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to hard delete house",
    };
  }
}

export async function clearExpiredHouseDates() {
  try {
    const now = new Date();

    // Find houses where endDate has passed
    const expiredHouses = await db.house.findMany({
      where: {
        endDate: {
          lt: now, // endDate is less than current time
        },
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        endDate: true,
      },
    });

    if (expiredHouses.length === 0) {
      return { success: true, message: "No expired dates found", count: 0 };
    }

    // Update houses to clear their dates
    const updateResult = await db.house.updateMany({
      where: {
        endDate: {
          lt: now,
        },
        isDeleted: false,
      },
      data: {
        startDate: null,
        endDate: null,
      },
    });

    return {
      success: true,
      message: `Cleared dates for ${updateResult.count} houses`,
      count: updateResult.count,
      clearedHouses: expiredHouses.map((h) => ({
        id: h.id,
        title: h.title,
        expiredDate: h.endDate,
      })),
    };
  } catch (error) {
    console.error("Error clearing expired house dates:", error);
    return {
      success: false,
      error: "Failed to clear expired house dates",
    };
  }
}

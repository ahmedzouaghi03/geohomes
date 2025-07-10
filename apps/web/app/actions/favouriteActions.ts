"use server";

import { db } from "@monkeyprint/db";
import { revalidatePath } from "next/cache";

interface AddFavoriteParams {
  email: string;
  name?: string;
  houseId: string;
}

export async function addFavorite({ email, name, houseId }: AddFavoriteParams) {
  try {
    // Check if the house exists
    const house = await db.house.findUnique({
      where: {
        id: houseId,
        isDeleted: false,
      },
    });

    if (!house) {
      return { success: false, error: "House not found" };
    }

    // Find or create client
    let client = await db.client.findUnique({
      where: { email },
    });

    if (!client) {
      client = await db.client.create({
        data: {
          email,
          name: name || null,
        },
      });
    } else if (name && !client.name) {
      // Update client name if it was provided and not already set
      await db.client.update({
        where: { id: client.id },
        data: { name },
      });
    }

    // Check if favorite already exists
    const existingFavorite = await db.favorite.findFirst({
      where: {
        clientId: client.id,
        houseId,
      },
    });

    if (existingFavorite) {
      return { success: true, data: existingFavorite };
    }

    // Create favorite
    const favorite = await db.favorite.create({
      data: {
        clientId: client.id,
        houseId,
      },
    });

    revalidatePath("/houses");

    return { success: true, data: favorite };
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add to wishlist",
    };
  }
}

export async function getFavoritesByEmail(email: string) {
  try {
    const client = await db.client.findUnique({
      where: { email },
      include: {
        favorites: {
          include: {
            house: {
              include: {
                position: {
                  include: {
                    city: true,
                  },
                },
                options: true,
              },
            },
          },
        },
      },
    });

    if (!client) {
      return { success: false, error: "Client not found" };
    }

    return {
      success: true,
      data: client.favorites.filter((fav) => !fav.house.isDeleted),
    };
  } catch (error) {
    console.error("Failed to get favorites:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get wishlist",
    };
  }
}

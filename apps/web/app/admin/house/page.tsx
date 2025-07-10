"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { getCurrentUser } from "@/actions/authActions";
import { getHouses, deleteHouse, updateHouse } from "@/actions/houseActions";
import { House, HouseCategory, HouseType } from "@/types";
import { Trash2, Edit, Calendar, Eye } from "lucide-react";

export default function AdminHousePage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string>("");
  const [editingDates, setEditingDates] = useState<string | null>(null);
  const [tempDates, setTempDates] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  useEffect(() => {
    fetchAdminHouses();
  }, []);

  const fetchAdminHouses = async () => {
    try {
      setLoading(true);

      // Get current admin
      const currentUser = await getCurrentUser();
      if (!currentUser?.id) {
        toast.error("You must be logged in to view your houses");
        return;
      }

      setAdminId(currentUser.id);

      // Fetch houses for this admin
      const result = await getHouses({
        adminId: currentUser.id,
        page: 1,
        limit: 1000, // Get all houses for this admin
      });

      if (result.success) {
        setHouses(result.data as House[]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to fetch houses:", error);
      toast.error("Failed to load houses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHouse = async (houseId: string, houseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${houseTitle}"?`)) {
      return;
    }

    try {
      const result = await deleteHouse(houseId);
      if (result.success) {
        toast.success("House deleted successfully");
        // Remove from local state
        setHouses((prev) => prev.filter((house) => house.id !== houseId));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to delete house:", error);
      toast.error("Failed to delete house");
    }
  };

  const handleEditDates = (
    houseId: string,
    startDate?: Date | string,
    endDate?: Date | string
  ) => {
    setEditingDates(houseId);
    setTempDates({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  };

  const handleSaveDates = async (houseId: string) => {
    try {
      const result = await updateHouse({
        id: houseId,
        startDate: tempDates.startDate,
        endDate: tempDates.endDate,
      });

      if (result.success) {
        toast.success("Dates updated successfully");
        // Update local state
        setHouses((prev) =>
          prev.map((house) =>
            house.id === houseId
              ? {
                  ...house,
                  startDate: tempDates.startDate,
                  endDate: tempDates.endDate,
                }
              : house
          )
        );
        setEditingDates(null);
        setTempDates({});
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to update dates:", error);
      toast.error("Failed to update dates");
    }
  };

  const handleCancelDateEdit = () => {
    setEditingDates(null);
    setTempDates({});
  };

  const formatPrice = (price?: number) => {
    if (!price) return "-";
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const displayPrice = (house: House) => {
    if (house.prixMin && house.prixMax) {
      if (house.prixMin === house.prixMax) {
        return formatPrice(house.prixMin);
      }
      return `${formatPrice(house.prixMin)} - ${formatPrice(house.prixMax)}`;
    } else if (house.prixMin) {
      return `${formatPrice(house.prixMin)}`;
    } else if (house.prixMax) {
      return `${formatPrice(house.prixMax)}`;
    }
    return "Prix sur demande";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <Link
          href="/admin/house/createHouse"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Property
        </Link>
      </div>

      {houses.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">No Properties Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't created any properties yet. Start by adding your first
              property.
            </p>
            <Link
              href="/admin/house/createHouse"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
            >
              Create Your First Property
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((house) => (
            <div
              key={house.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border"
            >
              {/* Image Section */}
              <div className="relative h-64">
                {house.images && house.images.length > 0 ? (
                  <Image
                    src={house.images[0]}
                    alt={house.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span>No image available</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                    {house.category === HouseCategory.VENTE
                      ? "À VENDRE"
                      : house.category === HouseCategory.LOCATION
                        ? "À LOUER"
                        : "LOCATION VACANCES"}
                  </span>
                </div>

                {/* Action Buttons - Positioned on image */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link
                    href={`/house/${house.id}`}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                    title="View Property"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    href={`/admin/house/${house.id}`}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:text-green-600 transition-colors"
                    title="Edit Property"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDeleteHouse(house.id, house.title)}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-600 transition-colors"
                    title="Delete Property"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-2">{house.title}</h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <span>📍 {house.position?.city?.name || "N/A"}</span>
                    {house.position?.address && (
                      <span className="ml-2">• {house.position.address}</span>
                    )}
                  </div>
                  <div className="text-lg font-semibold text-blue-600 mb-3">
                    {displayPrice(house)}
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Type:</span>
                    <div className="font-medium">
                      {house.type === HouseType.APPARTEMENT
                        ? "Appartement"
                        : house.type === HouseType.MAISON
                          ? "Maison"
                          : "Villa"}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Surface:</span>
                    <div className="font-medium">{house.area || "N/A"} m²</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Chambres:</span>
                    <div className="font-medium">{house.rooms}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Salles de bain:</span>
                    <div className="font-medium">{house.bathrooms}</div>
                  </div>
                </div>

                {/* Description */}
                {house.description && (
                  <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                    {house.description}
                  </p>
                )}

                {/* Date Management */}
                <div className="border-t pt-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Indisponibilité:
                    </span>

                    {editingDates === house.id ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <DatePicker
                            selected={tempDates.startDate}
                            onChange={(date) =>
                              setTempDates((prev) => ({
                                ...prev,
                                startDate: date || undefined,
                              }))
                            }
                            placeholderText="Start date"
                            className="text-sm border rounded px-2 py-1 flex-1"
                            dateFormat="dd/MM/yyyy"
                          />
                          <span className="text-sm">to</span>
                          <DatePicker
                            selected={tempDates.endDate}
                            onChange={(date) =>
                              setTempDates((prev) => ({
                                ...prev,
                                endDate: date || undefined,
                              }))
                            }
                            placeholderText="End date"
                            className="text-sm border rounded px-2 py-1 flex-1"
                            dateFormat="dd/MM/yyyy"
                            minDate={tempDates.startDate}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveDates(house.id)}
                            className="text-green-600 hover:text-green-700 px-3 py-1 text-sm border border-green-600 rounded hover:bg-green-50 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelDateEdit}
                            className="text-gray-600 hover:text-gray-700 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {house.startDate && house.endDate
                            ? `${new Date(house.startDate).toLocaleDateString()} - ${new Date(house.endDate).toLocaleDateString()}`
                            : house.startDate
                              ? `From ${new Date(house.startDate).toLocaleDateString()}`
                              : house.endDate
                                ? `Until ${new Date(house.endDate).toLocaleDateString()}`
                                : "No dates set"}
                        </span>
                        <button
                          onClick={() =>
                            handleEditDates(
                              house.id,
                              house.startDate,
                              house.endDate
                            )
                          }
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Edit availability dates"
                        >
                          <Calendar size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Created/Updated info */}
                <div className="text-xs text-gray-500 mt-4 pt-2 border-t">
                  Created: {new Date(house.createdAt).toLocaleDateString()}
                  {house.updatedAt !== house.createdAt && (
                    <span className="ml-4">
                      Updated: {new Date(house.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

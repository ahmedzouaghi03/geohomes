"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { getCurrentUser } from "@/actions/authActions";
import { getHouses, clearExpiredHouseDates } from "@/actions/houseActions";
import { House, HouseCategory, HouseType, Admin } from "@/types";
import {
  Eye,
  Edit,
  Calendar,
  Home,
  TrendingUp,
  Users,
  MapPin,
  Plus,
  Clock,
} from "lucide-react";

interface DashboardStats {
  totalHouses: number;
  availableHouses: number;
  occupiedHouses: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [houses, setHouses] = useState<House[]>([]);
  const [availableHouses, setAvailableHouses] = useState<House[]>([]);
  const [occupiedHouses, setOccupiedHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Admin | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalHouses: 0,
    availableHouses: 0,
    occupiedHouses: 0,
    totalViews: 0,
  });

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    // Check for expired dates when component mounts
    const checkExpiredDates = async () => {
      try {
        const result = await clearExpiredHouseDates();
        if (result.success && result.count && result.count > 0) {
          toast.success(`Cleared ${result.count} expired house dates`);
          // Refresh the houses list
          const admin = await getCurrentUser();
          if (admin?.id) {
            const housesResult = await getHouses({
              adminId: admin.id,
              page: 1,
              limit: 1000,
            });
          }
        }
      } catch (error) {
        console.error("Error checking expired dates:", error);
      }
    };

    checkExpiredDates();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);

      // Get current admin
      const admin = await getCurrentUser();
      if (!admin?.id) {
        toast.error("Vous devez être connecté");
        router.push("/auth/login");
        return;
      }
      setCurrentUser(admin as Admin);

      // Fetch all houses for this admin
      const result = await getHouses({
        adminId: admin.id,
        page: 1,
        limit: 1000,
      });

      if (result.success) {
        const allHouses = result.data as House[];
        setHouses(allHouses);

        // Filter available and occupied houses
        const available = filterAvailableHouses(allHouses);
        const occupied = filterOccupiedHouses(allHouses);
        setAvailableHouses(available);
        setOccupiedHouses(occupied);

        // Calculate stats
        const dashboardStats: DashboardStats = {
          totalHouses: allHouses.length,
          availableHouses: available.length,
          occupiedHouses: occupied.length,
          totalViews: 0, // You can implement view tracking later
        };
        setStats(dashboardStats);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      toast.error("Échec du chargement du tableau de bord");
    } finally {
      setLoading(false);
    }
  };

  // Filter houses that are available (no dates or end date has passed)
  const filterAvailableHouses = (houses: House[]): House[] => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for comparison

    return houses.filter((house) => {
      // If no dates are set, house is available
      if (!house.startDate && !house.endDate) {
        return true;
      }

      // If only start date is set, house is not available (occupied)
      if (house.startDate && !house.endDate) {
        return false;
      }

      // If only end date is set, check if it has passed
      if (!house.startDate && house.endDate) {
        const endDate = new Date(house.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate < currentDate;
      }

      // If both dates are set, check if current date is after end date
      if (house.startDate && house.endDate) {
        const endDate = new Date(house.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate < currentDate;
      }

      return false;
    });
  };

  // Filter houses that are occupied (not available)
  const filterOccupiedHouses = (houses: House[]): House[] => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for comparison

    return houses.filter((house) => {
      // If no dates are set, house is available (not occupied)
      if (!house.startDate && !house.endDate) {
        return false;
      }

      // If only start date is set, house is occupied
      if (house.startDate && !house.endDate) {
        return true;
      }

      // If only end date is set, check if it hasn't passed yet
      if (!house.startDate && house.endDate) {
        const endDate = new Date(house.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate >= currentDate;
      }

      // If both dates are set, check if current date is within the range
      if (house.startDate && house.endDate) {
        const startDate = new Date(house.startDate);
        const endDate = new Date(house.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return currentDate >= startDate && currentDate <= endDate;
      }

      return false;
    });
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
      return `À partir de ${formatPrice(house.prixMin)}`;
    } else if (house.prixMax) {
      return `Jusqu'à ${formatPrice(house.prixMax)}`;
    }
    return "Prix sur demande";
  };

  const getCategoryLabel = (category: HouseCategory) => {
    switch (category) {
      case HouseCategory.VENTE:
        return "À Vendre";
      case HouseCategory.LOCATION:
        return "À Louer";
      case HouseCategory.LOCATION_VACANCES:
        return "Location Vacances";
      default:
        return category;
    }
  };

  const getTypeLabel = (type: HouseType) => {
    switch (type) {
      case HouseType.APPARTEMENT:
        return "Appartement";
      case HouseType.MAISON:
        return "Maison";
      case HouseType.VILLA:
        return "Villa";
      default:
        return type;
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Non définie";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const getOccupiedUntil = (house: House) => {
    if (house.endDate) {
      return `Jusqu'au ${formatDate(house.endDate)}`;
    }
    return "Occupation indéterminée";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A5FCD] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de Bord
        </h1>
        <p className="text-gray-600">
          Bienvenue, {currentUser?.name || "Admin"}. Voici un aperçu de vos
          propriétés disponibles.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Home className="h-8 w-8 text-[#3A5FCD]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Propriétés
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalHouses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.availableHouses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Occupées</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.occupiedHouses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Taux Disponibilité
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalHouses > 0
                  ? Math.round(
                      (stats.availableHouses / stats.totalHouses) * 100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Actions Rapides
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/house/createHouse"
            className="inline-flex items-center px-4 py-2 bg-[#3A5FCD] text-white rounded-md hover:bg-[#193997] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une Propriété
          </Link>
          <Link
            href="/admin/house"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Gérer Propriétés
          </Link>
          <Link
            href="/admin/city"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Gérer Villes
          </Link>
        </div>
      </div>

      {/* Available Houses */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Propriétés Disponibles ({availableHouses.length})
            </h2>
          </div>
        </div>

        <div className="p-6">
          {availableHouses.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune propriété disponible
              </h3>
              <p className="text-gray-600 mb-6">
                Toutes vos propriétés sont actuellement occupées ou vous n'avez
                pas encore de propriétés.
              </p>
              <Link
                href="/admin/house/createHouse"
                className="inline-flex items-center px-4 py-2 bg-[#3A5FCD] text-white rounded-md hover:bg-[#193997] transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une Propriété
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableHouses.slice(0, 6).map((house) => (
                <div
                  key={house.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    {house.images && house.images.length > 0 ? (
                      <Image
                        src={house.images[0]}
                        alt={house.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Disponible
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#3A5FCD] text-white px-2 py-1 rounded text-xs font-medium">
                        {getCategoryLabel(house.category)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {house.title}
                    </h3>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">
                        {house.position?.city?.name || "N/A"}
                        {house.position?.address &&
                          `, ${house.position.address}`}
                      </span>
                    </div>
                    <div
                      className={`items-center justify-between text-sm text-gray-600 mb-3 ${
                        house.category === HouseCategory.VENTE
                          ? "flex"
                          : "hidden"
                      }`}
                    >
                      <span>{getTypeLabel(house.type)}</span>
                      <span>{house.area || "N/A"} m²</span>
                      <span>{house.rooms} pièces</span>
                    </div>

                    <div className="text-[#3A5FCD] font-semibold mb-3">
                      {displayPrice(house)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/house/${house.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Link>
                      <Link
                        href={`/admin/house/${house.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-[#3A5FCD] text-white rounded-md hover:bg-[#193997] transition-colors text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {availableHouses.length > 6 && (
            <div className="mt-6 text-center">
              <Link
                href="/admin/house"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Voir toutes les propriétés disponibles
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Occupied Houses */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Propriétés Occupées ({occupiedHouses.length})
            </h2>
          </div>
        </div>

        <div className="p-6">
          {occupiedHouses.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune propriété occupée
              </h3>
              <p className="text-gray-600">
                Toutes vos propriétés sont actuellement disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {occupiedHouses.slice(0, 6).map((house) => (
                <div
                  key={house.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow opacity-90"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    {house.images && house.images.length > 0 ? (
                      <Image
                        src={house.images[0]}
                        alt={house.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Occupée
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#3A5FCD] text-white px-2 py-1 rounded text-xs font-medium">
                        {getCategoryLabel(house.category)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {house.title}
                    </h3>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">
                        {house.position?.city?.name || "N/A"}
                        {house.position?.address &&
                          `, ${house.position.address}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{getTypeLabel(house.type)}</span>
                      <span>{house.area || "N/A"} m²</span>
                      <span>{house.rooms} pièces</span>
                    </div>

                    <div className="text-[#3A5FCD] font-semibold mb-2">
                      {displayPrice(house)}
                    </div>

                    {/* Occupation info */}
                    <div className="flex items-center text-sm text-orange-600 mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{getOccupiedUntil(house)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/house/${house.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Link>
                      <Link
                        href={`/admin/house/${house.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-[#3A5FCD] text-white rounded-md hover:bg-[#193997] transition-colors text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {occupiedHouses.length > 6 && (
            <div className="mt-6 text-center">
              <Link
                href="/admin/house"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Voir toutes les propriétés occupées
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getCities, addCity, deleteCity } from "@/actions/cityActions";
import { City, Governorat } from "@/types";
import BackButton from "@/components/ui/BackButton";

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCityName, setNewCityName] = useState("");
  const [selectedGovernorat, setSelectedGovernorat] = useState<Governorat>(
    Governorat.SOUSSE
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch cities
  const fetchCities = async () => {
    setIsLoading(true);
    try {
      const result = await getCities();
      if (result.success) {
        setCities(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      toast.error("Failed to load cities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCityName.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addCity(newCityName.trim(), selectedGovernorat);

      if (result.success) {
        toast.success(`City "${newCityName}" added successfully`);
        fetchCities(); // Reload the cities list
        setNewCityName("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Failed to add city:", error);
      toast.error("Failed to add city");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle city deletion
  const handleDeleteCity = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the city "${name}"?`)) {
      return;
    }

    setIsDeleting(id);

    try {
      const result = await deleteCity(id);

      if (result.success) {
        toast.success(`City "${name}" deleted successfully`);
        setCities((prev) => prev.filter((city) => city.id !== id));
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Failed to delete city:", error);
      toast.error("Failed to delete city");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex">
        <div className="mb-6">
          <BackButton color="black" />
        </div>
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--foreground)" }}
        >
          Manage Cities
        </h1>
      </div>
      {/* Add City Form */}
      <div
        className="rounded-lg shadow p-6 mb-8"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Add New City</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="cityName"
              className="block text-sm font-medium mb-1"
            >
              City Name
            </label>
            <input
              type="text"
              id="cityName"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              style={{
                borderColor: "var(--input)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              placeholder="Enter city name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="governorat"
              className="block text-sm font-medium mb-1"
            >
              Governorate
            </label>
            <select
              id="governorat"
              value={selectedGovernorat}
              onChange={(e) =>
                setSelectedGovernorat(e.target.value as Governorat)
              }
              className="w-full px-3 py-2 border rounded-md"
              style={{
                borderColor: "var(--input)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              disabled // Since we only have SOUSSE in the enum
            >
              <option value={Governorat.SOUSSE}>Sousse</option>
            </select>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              Currently, only Sousse governorate is supported in the system.
            </p>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add City"}
          </button>
        </form>
      </div>

      {/* Cities List */}
      <div
        className="rounded-lg shadow p-6"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Cities</h2>

        {isLoading ? (
          <p style={{ color: "var(--muted-foreground)" }}>Loading cities...</p>
        ) : cities.length === 0 ? (
          <p style={{ color: "var(--muted-foreground)" }}>
            No cities found. Add your first city above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y"
              style={{ borderColor: "var(--border)" }}
            >
              <thead>
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Governorate
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ borderColor: "var(--border)" }}
              >
                {cities.map((city) => (
                  <tr key={city.id}>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {city.name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {city.governorat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button
                        onClick={() => handleDeleteCity(city.id, city.name)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        disabled={isDeleting === city.id}
                        style={{
                          opacity: isDeleting === city.id ? 0.5 : 1,
                        }}
                      >
                        {isDeleting === city.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

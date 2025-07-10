"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  HouseCategory,
  HouseType,
  HouseState,
  Governorat,
  CreateHouseData,
} from "@/types";
import { City } from "@monkeyprint/db";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";

// Component to update map view when center changes
function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

// City coordinates mapping for Sousse region
const CITY_COORDINATES: Record<string, [number, number]> = {
  // Default coordinates for Sousse center
  default: [35.8245, 10.6346],

  // Cities with coordinates matched to IDs from your JSON
  cmc49022r0001zmiogry8e5ak: [35.8245, 10.6346], // Sousse Ville
  cmc5jrg1f0000q5llnnkk80x9: [35.876256, 10.593397], // Hammam Sousse
  cmc5jrl7q0001q5lljxpkj4ow: [35.8689, 10.5689], // Akouda
  cmc5jrpq70002q5ll5krxq5uz: [35.871143, 10.536704], // Kalaa Kebira
  cmc5jruq60003q5llrzyys6di: [35.7295, 10.5811], // Msaken
  cmc5kc7210004q5llodx52fgq: [36.134665, 10.377959], // Enfidha
  cmc5kcbj90005q5llriaepz3k: [36.0338, 10.5045], // Hergla
  cmc5kcg2m0006q5llepqgtn65: [35.956472, 10.470615], // Sidi Bou Ali
  cmc5kcj9e0007q5lle611mi3x: [35.932911, 10.299681], // Kondar
  cmc5kdq0z0008q5ll8dn48yup: [36.276409, 10.42194], // Bouficha
  cmc5kf741000aq5llvm84bxjr: [35.681968, 10.311869], // Sidi El Heni
  cmc5khnxz000bq5llv1okyldp: [35.828952, 10.617772], // Sousse Jaouhara
  cmc5khrd3000cq5ll0a3r6pwk: [35.804762, 10.605412], // Sousse Riadh
  cmc5ki8cr000dq5lli37vzbxy: [35.8922, 10.5983], // Kantaoui
  cmc5kib56000eq5ll0t14x5uj: [35.822963, 10.634639], // Khzema
  cmc5kihw8000fq5lljp9jswkn: [35.836045, 10.599497], // Sahloul
  cmc5kiykv000gq5llfq8i7q1p: [35.938939, 10.548936], // Chatt Mariem
  cmc5kj95b000hq5ll5thth7uz: [35.804444, 10.638185], // Sidi Abdelhamid
  cmc5ku01l000jq5llulqml0ip: [35.824795, 10.561279], // Kalaâ Seghira
  cmc5p6ur80001hv99hwi4up9f: [35.793937, 10.584984], // Ezzouhour
  cmc5p7rkn0002hv99mnz8tsp6: [35.770352, 10.624134], // Ksibet Sousse
  cmc5p84bu0003hv99spynmw9t: [35.790628, 10.620385], // Zaouiet Sousse
  cmc5p8i9j0004hv9955ou0fda: [35.761436, 10.596571], // Messadine
  cmc5paawt0006hv99sbxgw2oi: [35.8922, 10.5983], // Kantaoui Port
};

interface HouseCreator1Props {
  formData: {
    category: HouseCategory;
    type: HouseType;
    state?: HouseState;
    position: {
      governorat: Governorat;
      cityId: string;
      address?: string;
      mapPosition?: string;
    };
  };
  updateFormData: (data: Partial<CreateHouseData>) => void;
  cities: City[];
}

export default function HouseCreator1({
  formData,
  updateFormData,
  cities,
}: HouseCreator1Props) {
  const [useMapPosition, setUseMapPosition] = useState(
    !!formData.position.mapPosition
  );

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    35.8245, 10.6346,
  ]); // Default to Sousse
  const [zoom, setZoom] = useState(13);
  const mapRef = useRef<L.Map>(null);

  // City data states
  const [cityCoordinates, setCityCoordinates] = useState<
    Record<string, [number, number]>
  >({});
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [cityLoadError, setCityLoadError] = useState<string | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Initialize city coordinates by mapping database cities to our hardcoded coordinates
  useEffect(() => {
    console.log("Initializing city coordinates...");
    console.log(
      "Available cities:",
      cities.map((c) => ({ id: c.id, name: c.name }))
    );

    // Create a new coordinates object starting with the default
    const mappedCoordinates: Record<string, [number, number]> = {
      default: CITY_COORDINATES.default,
    };

    // Directly copy any exact ID matches from CITY_COORDINATES
    cities.forEach((city) => {
      if (CITY_COORDINATES[city.id]) {
        mappedCoordinates[city.id] = CITY_COORDINATES[city.id];
        console.log(
          `✅ Direct ID match for ${city.name} (${city.id}): [${CITY_COORDINATES[city.id]}]`
        );
      } else {
        // For debugging, log that no direct match was found
        console.log(`❌ No direct ID match for ${city.name} (${city.id})`);
      }
    });

    // Log the final mapping for debugging
    console.log("Final city coordinates mapping:", mappedCoordinates);
    setCityCoordinates(mappedCoordinates);
  }, [cities]);

  // Function to get place name from coordinates using GeoNames API
  const getPlaceFromCoordinates = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);

    try {
      console.log(
        `Fetching place information for coordinates: [${lat}, ${lng}]`
      );

      // Call GeoNames API for reverse geocoding
      const response = await fetch(
        `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&username=ahmed7arboucha`
      );

      if (!response.ok) {
        throw new Error(
          `GeoNames API responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("GeoNames reverse geocoding response:", data);

      if (data.geonames && data.geonames.length > 0) {
        const place = data.geonames[0];

        // Find matching city in our database
        const cityMatch = findClosestCity(lat, lng, place.name);

        // Format address
        const address = `${place.name}, ${place.adminName1}`;

        return {
          cityId: cityMatch?.id || "",
          address: address,
        };
      }

      return null;
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return null;
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Helper function to find closest city to coordinates
  const findClosestCity = (lat: number, lng: number, placeName?: string) => {
    // First try to match by name if provided
    if (placeName) {
      const placeNameLower = placeName.toLowerCase().trim();
      const nameMatch = cities.find((city) => {
        const cityNameLower = city.name.toLowerCase().trim();
        return (
          cityNameLower === placeNameLower ||
          cityNameLower.includes(placeNameLower) ||
          placeNameLower.includes(cityNameLower)
        );
      });

      if (nameMatch) {
        return nameMatch;
      }
    }

    // If no name match, find closest city by coordinates
    let closestCity = null;
    let closestDistance = Number.MAX_VALUE;

    cities.forEach((city) => {
      const cityCoords = cityCoordinates[city.id];
      if (cityCoords) {
        // Calculate distance (simplified)
        const distance = Math.sqrt(
          Math.pow(cityCoords[0] - lat, 2) + Math.pow(cityCoords[1] - lng, 2)
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestCity = city;
        }
      }
    });

    return closestCity;
  };

  // Fix Leaflet icon issue
  useEffect(() => {
    // Fix Leaflet default icon issue in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  // MapEvents handler for click events
  function MapClickHandler() {
    const map = useMapEvents({
      click: handleMapClick,
    });
    return null;
  }

  // Update map when form data changes
  useEffect(() => {
    console.log("formData.position changed:", formData.position);

    if (useMapPosition && formData.position.mapPosition) {
      // Parse coordinates from string
      const coordinates = formData.position.mapPosition
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      if (
        coordinates.length === 2 &&
        !isNaN(coordinates[0]) &&
        !isNaN(coordinates[1])
      ) {
        console.log("Setting map center from mapPosition:", coordinates);
        setMapCenter([coordinates[0], coordinates[1]]);
        setZoom(15);
      }
    } else if (!useMapPosition && formData.position.cityId) {
      // Use city coordinates
      const cityId = formData.position.cityId;
      console.log("Looking for coordinates for city ID:", cityId);

      const cityCoords = cityCoordinates[cityId];
      if (cityCoords) {
        console.log("Found coordinates for city:", cityCoords);
        setMapCenter(cityCoords);
        setZoom(13);
      } else {
        console.log("No coordinates found for city ID, using default:", cityId);
        setMapCenter(CITY_COORDINATES.default);
        setZoom(11);
      }
    }
  }, [formData.position, useMapPosition, cityCoordinates]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes("position.")) {
      const positionField = name.split(".")[1];
      updateFormData({
        position: {
          ...formData.position,
          [positionField]: value,
        },
      });
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleMapPositionToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setUseMapPosition(isChecked);

    if (isChecked) {
      // If toggling to use map position, clear the address and cityId
      updateFormData({
        position: {
          ...formData.position,
          address: "",
          cityId: formData.position.cityId || cities[0]?.id || "",
          // Default to current map center if no position set
          mapPosition: `${mapCenter[0]},${mapCenter[1]}`,
        },
      });
    } else {
      // If toggling to not use map position, clear the mapPosition
      updateFormData({
        position: {
          ...formData.position,
          mapPosition: "",
        },
      });
    }
  };

  // Handle map click with reverse geocoding
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    if (useMapPosition) {
      const { lat, lng } = e.latlng;
      const formattedPosition = `${lat.toFixed(6)},${lng.toFixed(6)}`;

      // Update form with coordinates
      updateFormData({
        position: {
          ...formData.position,
          mapPosition: formattedPosition,
        },
      });

      setMapCenter([lat, lng]);

      // Get place information for these coordinates
      const placeInfo = await getPlaceFromCoordinates(lat, lng);

      if (placeInfo) {
        console.log("Found place information:", placeInfo);

        // Update form with place information while keeping map position
        updateFormData({
          position: {
            ...formData.position,
            mapPosition: formattedPosition,
            address: placeInfo.address || "",
            cityId: placeInfo.cityId || cities[0]?.id || "",
          },
        });
      } else {
        // If no place info found, set a default city to prevent the foreign key error
        updateFormData({
          position: {
            ...formData.position,
            mapPosition: formattedPosition,
            cityId: cities[0]?.id || "", // Use the first city as a fallback
          },
        });
      }
    }
  };

  // Handle marker drag with reverse geocoding
  const handleMarkerDragEnd = async (e: L.DragEndEvent) => {
    if (useMapPosition) {
      const marker = e.target;
      const position = marker.getLatLng();
      const lat = position.lat;
      const lng = position.lng;
      const formattedPosition = `${lat.toFixed(6)},${lng.toFixed(6)}`;

      // Update form with coordinates
      updateFormData({
        position: {
          ...formData.position,
          mapPosition: formattedPosition,
        },
      });

      setMapCenter([lat, lng]);

      // Get place information for these coordinates
      const placeInfo = await getPlaceFromCoordinates(lat, lng);

      if (placeInfo) {
        console.log("Found place information:", placeInfo);

        // Update form with place information while keeping map position
        updateFormData({
          position: {
            ...formData.position,
            mapPosition: formattedPosition,
            address: placeInfo.address || "",
            cityId: placeInfo.cityId || cities[0]?.id || "",
          },
        });
      } else {
        // If no place info found, set a default city to prevent the foreign key error
        updateFormData({
          position: {
            ...formData.position,
            mapPosition: formattedPosition,
            cityId: cities[0]?.id || "",
          },
        });
      }
    }
  };

  // Process user-entered coordinates and get place information
  const handleCoordinatesInput = async (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    if (useMapPosition && formData.position.mapPosition) {
      const coordinates = formData.position.mapPosition
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      if (
        coordinates.length === 2 &&
        !isNaN(coordinates[0]) &&
        !isNaN(coordinates[1])
      ) {
        const [lat, lng] = coordinates;

        // Get place information for these coordinates
        const placeInfo = await getPlaceFromCoordinates(lat, lng);

        if (placeInfo) {
          console.log(
            "Found place information for entered coordinates:",
            placeInfo
          );

          // Update form with place information while keeping map position
          updateFormData({
            position: {
              ...formData.position,
              address: placeInfo.address || "",
              cityId: placeInfo.cityId || cities[0]?.id || "",
            },
          });
        } else {
          // If no place info found, set a default city to prevent the foreign key error
          updateFormData({
            position: {
              ...formData.position,
              cityId: cities[0]?.id || "", // Use the first city as a fallback
            },
          });
        }
      }
    }
  };

  return (
    <div className="space-y-8 py-4">
      <h2
        className="text-2xl font-semibold mb-6"
        style={{ color: "var(--foreground)" }}
      >
        Basic Property Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* House Category Selection */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Property Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1  focus:ring-blue-500"
            style={{
              borderColor: "var(--input)",
              color: "var(--foreground)",
            }}
            required
          >
            <option value={HouseCategory.VENTE}>Sale</option>
            <option value={HouseCategory.LOCATION}>Rent</option>
            <option value={HouseCategory.LOCATION_VACANCES}>
              Vacation Rental
            </option>
          </select>
        </div>

        {/* House Type Selection */}
        <div className="space-y-2">
          <label
            htmlFor="type"
            className="block text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Property Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1  focus:ring-blue-500"
            style={{
              borderColor: "var(--input)",
              color: "var(--foreground)",
            }}
            required
          >
            <option value={HouseType.APPARTEMENT}>Apartment</option>
            <option value={HouseType.MAISON}>House</option>
            <option value={HouseType.VILLA}>Villa</option>
          </select>
        </div>

        {/* House State Selection */}
        <div className="space-y-2">
          <label
            htmlFor="state"
            className="block text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Property Condition
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1  focus:ring-blue-500"
            style={{
              borderColor: "var(--input)",
              color: "var(--foreground)",
            }}
            required
          >
            <option value={HouseState.NOUVEAU}>New</option>
            <option value={HouseState.BON_ETAT}>Good Condition</option>
            <option value={HouseState.ETAT_ACCEPTABLE}>
              Acceptable Condition
            </option>
          </select>
        </div>
      </div>

      {/* Location Information */}
      <div
        className="pt-6 border-t border-gray-200"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Location Details
        </h3>

        {/* Status indicators */}
        {isLoadingCities && (
          <div
            className="mb-4 p-2 bg-blue-50 rounded text-sm"
            style={{
              backgroundColor: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            Loading city data...
          </div>
        )}

        {isReverseGeocoding && (
          <div
            className="mb-4 p-2 bg-blue-50 rounded text-sm"
            style={{
              backgroundColor: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            Getting location information...
          </div>
        )}

        {cityLoadError && (
          <div
            className="mb-4 p-2 bg-red-50 rounded text-sm"
            style={{
              backgroundColor: "var(--destructive)",
              color: "var(--destructive-foreground)",
            }}
          >
            <span>Error loading city data: {cityLoadError}</span>
          </div>
        )}

        {/* Two-column layout for location details and map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Location form */}
          <div className="space-y-4">
            {/* Governorate (Fixed to Sousse) */}
            <div className="space-y-2 mb-4">
              <label
                htmlFor="governorat"
                className="block text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Governorate
              </label>
              <input
                type="text"
                id="governorat"
                value="SOUSSE"
                disabled
                className="w-full px-3 py-2 border rounded-md shadow-sm opacity-70"
                style={{
                  borderColor: "var(--input)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="useMapPosition"
                  name="useMapPosition"
                  type="checkbox"
                  checked={useMapPosition}
                  onChange={handleMapPositionToggle}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="useMapPosition"
                  className="ml-2 block text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  Use map position instead of address
                </label>
              </div>
            </div>
            {useMapPosition ? (
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="mapPosition"
                  className="block text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  Map Position (Coordinates)
                </label>
                <input
                  type="text"
                  id="mapPosition"
                  name="position.mapPosition"
                  value={formData.position.mapPosition || ""}
                  onChange={handleInputChange}
                  onBlur={handleCoordinatesInput}
                  placeholder="e.g. 35.8245,10.6346"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  style={{
                    borderColor: "var(--input)",
                    color: "var(--foreground)",
                  }}
                />
                <p
                  className="text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Enter coordinates in format: latitude,longitude
                </p>

                {/* Show detected location in map mode */}
                {formData.position.address && (
                  <div className="mt-3">
                    <label
                      className="block text-sm font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      Detected Location
                    </label>
                    <div
                      className="w-full px-3 py-2 border rounded-md bg-opacity-70"
                      style={{
                        borderColor: "var(--input)",
                        backgroundColor: "var(--muted)",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {formData.position.address}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="cityId"
                    className="block text-sm font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    City
                  </label>
                  <select
                    id="cityId"
                    name="position.cityId"
                    value={formData.position.cityId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    style={{
                      borderColor: "var(--input)",
                      color: "var(--foreground)",
                    }}
                    required={!useMapPosition}
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="position.address"
                    value={formData.position.address || ""}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    className="w-full px-3 py-2 border rounded-md  focus:outline-none focus:ring-1 focus:ring-blue-500"
                    style={{
                      borderColor: "var(--input)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </>
            )}
            {/* Location selection instructions */}
            <div
              className="mt-4 p-3 bg-blue-50 rounded-md"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              <h4 className="text-sm font-medium mb-1">Map Instructions:</h4>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Click on the map to set a precise location</li>
                <li>Drag the marker to fine-tune the position</li>
                <li>Zoom in/out using the +/- controls or mouse wheel</li>
                <li>
                  Location details will be automatically determined from
                  coordinates
                </li>
              </ul>
            </div>
          </div>

          {/* Right column: Interactive Map */}
          <div
            className="h-[400px] border rounded-md overflow-hidden shadow-md"
            style={{ borderColor: "var(--border)" }}
          >
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              style={{ height: "100%", width: "100%" }}
              ref={(map) => {
                if (map) {
                  mapRef.current = map;
                }
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={mapCenter}
                draggable={useMapPosition}
                eventHandlers={{
                  dragend: handleMarkerDragEnd,
                }}
              />
              <MapUpdater center={mapCenter} zoom={zoom} />
              {/* Map click handler */}
              {useMapPosition && <MapClickHandler />}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

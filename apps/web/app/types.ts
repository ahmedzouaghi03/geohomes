// House Enums
export enum Emplacement {
  RDC = "RDC",
  PREMIERE_ETAGE = "PREMIERE_ETAGE",
  DEUXIEME_ETAGE = "DEUXIEME_ETAGE",
  TROISIEME_ETAGE = "TROISIEME_ETAGE",
}

export enum HouseCategory {
  VENTE = "VENTE",
  LOCATION = "LOCATION",
  LOCATION_VACANCES = "LOCATION_VACANCES",
}

export enum HouseType {
  APPARTEMENT = "APPARTEMENT",
  MAISON = "MAISON",
  VILLA = "VILLA",
}

export enum HouseState {
  NOUVEAU = "NOUVEAU",
  BON_ETAT = "BON_ETAT",
  ETAT_ACCEPTABLE = "ETAT_ACCEPTABLE",
}

export enum SolType {
  PAQUET = "PAQUET",
  MARBRE = "MARBRE",
  CARRELAGE = "CARRELAGE",
}

export enum LocationType {
  Annuelle = "Annuelle",
  Scolaire = "Scolaire",
}

// Extras Enums
export enum HeatingType {
  NONE = "NONE",
  CHAUFFAGE_CENTRALE = "CHAUFFAGE_CENTRALE",
  CHEMINE = "CHEMINE",
}

export enum GardenType {
  NONE = "NONE",
  NORMAL = "NORMAL",
  GAZON = "GAZON",
}

// Location Enums
export enum Governorat {
  SOUSSE = "SOUSSE",
}

// City interface
export interface City {
  id: string;
  name: string;
  governorat: Governorat;
}

// Admin interface
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumbers: string[];
}

// Position interface
export interface HousePosition {
  id: string;
  address?: string;
  mapPosition?: string;
  governorat: Governorat;
  cityId: string;
  city?: City;
}

// Options interface
export interface HouseOptions {
  id: string;
  piscine: boolean;
  piedDansEau: boolean;
  elevator: boolean;
  clim: boolean;
  internet: boolean;
  garden: GardenType;
  heating: HeatingType;
  porteBlinde: boolean;
  doubleVitrage: boolean;
  cameraSecurite: boolean;
  concierge: boolean;
  furnished: boolean;
  kitchenEquipped: boolean;
  refrigerator: boolean;
  four: boolean;
  tv: boolean;
  washingMachine: boolean;
  microwave: boolean;
  entreSeul: boolean;
  garage: boolean;
  parking: boolean;
  terrasse: boolean;
  animalAuthorized: boolean;
}

// House interface
export interface House {
  id: string;
  title: string;
  description?: string;
  area?: number;
  rooms: number;
  bathrooms: number;
  toilets: number;
  floors?: number;

  category: HouseCategory;
  type: HouseType;
  emplacement?: Emplacement;
  state?: HouseState;
  solType?: SolType;
  locationType?: LocationType | null;

  images: string[];
  prixMin?: number;
  prixMax?: number;

  startDate?: string | Date | null;
  endDate?: string | Date | null;

  phoneNumbers: string[];

  // Relations
  position?: HousePosition;
  options?: HouseOptions;
  admin?: Admin;

  createdAt: string | Date;
  updatedAt: string | Date;
  isDeleted: boolean;
}

// Response type for API functions
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

// Interface for creating HousePosition
export interface CreateHousePositionData {
  address?: string;
  mapPosition?: string;
  governorat: Governorat;
  cityId: string; // City reference
}

// Interface for creating HouseOptions
export interface CreateHouseOptionsData {
  // Swimming and Comfort
  piscine?: boolean;
  piedDansEau?: boolean;
  elevator?: boolean;
  clim?: boolean;
  internet?: boolean;

  // Type Enums
  garden?: GardenType;
  heating?: HeatingType;

  // Security
  porteBlinde?: boolean;
  doubleVitrage?: boolean;
  cameraSecurite?: boolean;
  concierge?: boolean;

  // Furnishing
  furnished?: boolean;
  kitchenEquipped?: boolean;
  refrigerator?: boolean;
  four?: boolean;
  tv?: boolean;
  washingMachine?: boolean;
  microwave?: boolean;

  // Access and Extras
  entreSeul?: boolean;
  garage?: boolean;
  parking?: boolean;
  terrasse?: boolean;
  animalAuthorized?: boolean;
}

// Interface for creating a house
export interface CreateHouseData {
  title: string;
  description?: string;
  area?: number;
  rooms: number;
  bathrooms: number;
  toilets: number;
  floors?: number;

  category: HouseCategory;
  type: HouseType;
  emplacement?: Emplacement;
  state?: HouseState;
  solType?: SolType;
  locationType?: LocationType;

  images: string[];
  prixMin?: number;
  prixMax?: number;

  startDate?: Date;
  endDate?: Date;

  phoneNumbers: string[];

  // Required relations
  position: CreateHousePositionData;
  options: CreateHouseOptionsData;
  adminId: string;
}

// Interface for updating a house
export interface UpdateHouseData
  extends Partial<
    Omit<CreateHouseData, "position" | "options" | "startDate" | "endDate">
  > {
  id: string;
  position?: Partial<CreateHousePositionData>;
  options?: Partial<CreateHouseOptionsData>;
  // Override date fields to allow null for clearing
  startDate?: Date | null;
  endDate?: Date | null;
}

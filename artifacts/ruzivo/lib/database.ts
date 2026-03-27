import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Plant {
  id: string;
  name_common: string;
  name_scientific: string;
  image_url: string | null;
  safety_status: "Safe" | "Caution" | "Toxic";
  uses: string[];
  warnings: string[];
  traditional_uses: string[];
  local_names: Record<string, string>;
}

export interface Scan {
  id: string;
  image_uri: string;
  identified_name: string | null;
  confidence_score: number | null;
  timestamp: string;
}

const SEED_PLANTS: Plant[] = [
  {
    id: "aloe-vera",
    name_common: "Aloe Vera",
    name_scientific: "Aloe barbadensis miller",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Skin healing and burns",
      "Digestive aid",
      "Anti-inflammatory",
      "Wound healing",
      "Moisturizer",
    ],
    warnings: [
      "Excess intake may irritate stomach",
      "Avoid during pregnancy",
      "May interact with diabetes medication",
    ],
    traditional_uses: [
      "Used for burns and skin cleansing in African traditions",
      "Applied to wounds and rashes as a healing gel",
      "Used in purification rituals",
    ],
    local_names: {
      Shona: "Gavakava",
      Zulu: "iNtandane",
      Afrikaans: "Aalwyn",
      Sotho: "Kgopane",
    },
  },
  {
    id: "moringa",
    name_common: "Moringa",
    name_scientific: "Moringa oleifera",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Immune system booster",
      "Nutritional supplement",
      "Anti-inflammatory",
      "Blood sugar regulation",
      "Antioxidant rich",
    ],
    warnings: [
      "Avoid excessive use",
      "Consult doctor if pregnant",
      "May lower blood pressure",
    ],
    traditional_uses: [
      "Known as the 'miracle tree' or 'healing tree'",
      "Leaves used in soups and teas for nutrition",
      "Seeds used to purify water in rural communities",
    ],
    local_names: {
      Shona: "Moringa",
      Zulu: "umBhikabhika",
      Swahili: "Mzungu wa Nazi",
      Yoruba: "Ewe Ile Oyinbo",
    },
  },
  {
    id: "neem",
    name_common: "Neem",
    name_scientific: "Azadirachta indica",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Antibacterial treatment",
      "Skin conditions",
      "Dental hygiene",
      "Insect repellent",
      "Antifungal",
    ],
    warnings: [
      "Toxic in large amounts — use carefully",
      "Never give to children in high doses",
      "Avoid during pregnancy",
      "Can cause liver damage if overused",
    ],
    traditional_uses: [
      "Used for cleansing and spiritual protection",
      "Twigs used as natural toothbrushes",
      "Leaves burned to repel mosquitoes",
    ],
    local_names: {
      Shona: "Munyii",
      Swahili: "Mwarobaini",
      Hausa: "Dáwáníyà",
      Zulu: "Neem",
    },
  },
  {
    id: "rooibos",
    name_common: "Rooibos",
    name_scientific: "Aspalathus linearis",
    image_url: null,
    safety_status: "Safe",
    uses: [
      "Herbal tea",
      "Rich in antioxidants",
      "Stress relief",
      "Improved sleep",
      "Heart health support",
    ],
    warnings: [
      "Generally safe for most people",
      "May have mild estrogenic effects",
      "Avoid excessive intake with liver conditions",
    ],
    traditional_uses: [
      "South African indigenous herbal tea since the 18th century",
      "Used by Khoisan people for medicinal purposes",
      "Applied to skin to relieve eczema and acne",
    ],
    local_names: {
      Afrikaans: "Rooibostee",
      Xhosa: "ibhodi",
      Khoikhoi: "Rooibos",
      English: "Red Bush Tea",
    },
  },
  {
    id: "african-potato",
    name_common: "African Potato",
    name_scientific: "Hypoxis hemerocallidea",
    image_url: null,
    safety_status: "Caution",
    uses: [
      "Immune system support",
      "Anti-inflammatory",
      "Prostate health",
      "Urinary tract health",
    ],
    warnings: [
      "Must be used correctly and in proper doses",
      "Can interact with HIV antiretrovirals",
      "Do not use with immunosuppressants",
      "Consult a traditional healer or doctor first",
    ],
    traditional_uses: [
      "Important African medicinal root used for centuries",
      "Used to treat fever, wounds, and heart weakness",
      "Corm roasted and eaten during illness",
      "Widely used in South African traditional medicine",
    ],
    local_names: {
      Zulu: "inkomfe",
      Sotho: "Lotsane",
      Shona: "Chikaka",
      Xhosa: "inkomfe",
    },
  },
];

const PLANTS_KEY = "@ruzivo/plants";
const SCANS_KEY = "@ruzivo/scans";

let initialized = false;

async function initAsyncStorage(): Promise<void> {
  if (initialized) return;
  const existing = await AsyncStorage.getItem(PLANTS_KEY);
  if (!existing) {
    await AsyncStorage.setItem(PLANTS_KEY, JSON.stringify(SEED_PLANTS));
  }
  initialized = true;
}

export async function initDatabase(): Promise<void> {
  if (Platform.OS === "web") {
    await initAsyncStorage();
    return;
  }

  try {
    const SQLite = await import("expo-sqlite");
    const db = await SQLite.openDatabaseAsync("ruzivo.db");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY,
        name_common TEXT NOT NULL,
        name_scientific TEXT NOT NULL,
        image_url TEXT,
        safety_status TEXT NOT NULL,
        uses TEXT NOT NULL,
        warnings TEXT NOT NULL,
        traditional_uses TEXT NOT NULL,
        local_names TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        image_uri TEXT NOT NULL,
        identified_name TEXT,
        confidence_score REAL,
        timestamp TEXT NOT NULL
      );
    `);

    const existing = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM plants"
    );
    if (!existing || existing.count === 0) {
      for (const plant of SEED_PLANTS) {
        await db.runAsync(
          `INSERT OR IGNORE INTO plants (id, name_common, name_scientific, image_url, safety_status, uses, warnings, traditional_uses, local_names)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            plant.id,
            plant.name_common,
            plant.name_scientific,
            plant.image_url,
            plant.safety_status,
            JSON.stringify(plant.uses),
            JSON.stringify(plant.warnings),
            JSON.stringify(plant.traditional_uses),
            JSON.stringify(plant.local_names),
          ]
        );
      }
    }
  } catch (err) {
    console.warn("SQLite not available, falling back to AsyncStorage:", err);
    await initAsyncStorage();
  }
}

async function getNativePlants(): Promise<Plant[]> {
  try {
    const SQLite = await import("expo-sqlite");
    const db = await SQLite.openDatabaseAsync("ruzivo.db");
    const rows = await db.getAllAsync<{
      id: string;
      name_common: string;
      name_scientific: string;
      image_url: string | null;
      safety_status: string;
      uses: string;
      warnings: string;
      traditional_uses: string;
      local_names: string;
    }>("SELECT * FROM plants ORDER BY name_common ASC");
    return rows.map((r) => ({
      ...r,
      safety_status: r.safety_status as Plant["safety_status"],
      uses: JSON.parse(r.uses),
      warnings: JSON.parse(r.warnings),
      traditional_uses: JSON.parse(r.traditional_uses),
      local_names: JSON.parse(r.local_names),
    }));
  } catch {
    return getWebPlants();
  }
}

async function getWebPlants(): Promise<Plant[]> {
  const data = await AsyncStorage.getItem(PLANTS_KEY);
  if (!data) return [...SEED_PLANTS];
  return JSON.parse(data) as Plant[];
}

export async function getAllPlants(): Promise<Plant[]> {
  if (Platform.OS !== "web") return getNativePlants();
  return getWebPlants();
}

export async function searchPlants(query: string): Promise<Plant[]> {
  const plants = await getAllPlants();
  const q = query.toLowerCase();
  return plants.filter(
    (p) =>
      p.name_common.toLowerCase().includes(q) ||
      p.name_scientific.toLowerCase().includes(q)
  );
}

export async function getPlantsByFilter(
  filter: "Medicinal" | "Toxic" | "Food"
): Promise<Plant[]> {
  const plants = await getAllPlants();
  if (filter === "Toxic") {
    return plants.filter(
      (p) => p.safety_status === "Toxic" || p.safety_status === "Caution"
    );
  } else if (filter === "Food") {
    return plants.filter((p) => p.safety_status === "Safe");
  }
  return plants;
}

export async function getPlantById(id: string): Promise<Plant | null> {
  const plants = await getAllPlants();
  return plants.find((p) => p.id === id) ?? null;
}

export async function saveScan(scan: Scan): Promise<void> {
  const data = await AsyncStorage.getItem(SCANS_KEY);
  const scans: Scan[] = data ? JSON.parse(data) : [];
  scans.unshift(scan);
  await AsyncStorage.setItem(SCANS_KEY, JSON.stringify(scans.slice(0, 50)));

  if (Platform.OS !== "web") {
    try {
      const SQLite = await import("expo-sqlite");
      const db = await SQLite.openDatabaseAsync("ruzivo.db");
      await db.runAsync(
        "INSERT OR REPLACE INTO scans (id, image_uri, identified_name, confidence_score, timestamp) VALUES (?, ?, ?, ?, ?)",
        [
          scan.id,
          scan.image_uri,
          scan.identified_name,
          scan.confidence_score,
          scan.timestamp,
        ]
      );
    } catch {
    }
  }
}

export async function getRecentScans(limit = 10): Promise<Scan[]> {
  const data = await AsyncStorage.getItem(SCANS_KEY);
  if (!data) return [];
  const scans: Scan[] = JSON.parse(data);
  return scans.slice(0, limit);
}

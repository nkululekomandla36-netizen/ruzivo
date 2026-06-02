import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;
const CACHE_PREFIX = "RUZIVO_KNOWLEDGE_";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface PlantKnowledge {
  overview: string;
  traditional_knowledge: string[];
  medicinal_cultural_uses: string[];
  safety_information: string[];
  habitat_ecology: string[];
  conservation_notes: string[];
}

interface CacheEntry {
  data: PlantKnowledge;
  timestamp: number;
}

const cacheKey = (nameScientific: string) =>
  `${CACHE_PREFIX}${nameScientific.toLowerCase().replace(/\s+/g, "_")}`;

const readCache = async (key: string): Promise<PlantKnowledge | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
};

const writeCache = async (key: string, data: PlantKnowledge): Promise<void> => {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {}
};

export const fetchPlantKnowledge = async (
  name_common: string,
  name_scientific: string,
  safety_status?: string
): Promise<PlantKnowledge | null> => {
  const key = cacheKey(name_scientific);

  // Return cached copy if available (works offline too)
  const cached = await readCache(key);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/plant-knowledge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_common, name_scientific, safety_status }),
    });

    if (!response.ok) return null;

    const knowledge: PlantKnowledge = await response.json();

    // Cache for offline use
    await writeCache(key, knowledge);

    return knowledge;
  } catch {
    // Offline or server error — fail silently
    return null;
  }
};

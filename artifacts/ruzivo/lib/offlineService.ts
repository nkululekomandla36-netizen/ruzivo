import AsyncStorage from "@react-native-async-storage/async-storage";
import { offlinePlants, OfflinePlant } from "./offlinePlants";

const BUSH_MODE_KEY = "RUZIVO_BUSH_MODE";
const LAST_PLANT_KEY = "RUZIVO_LAST_PLANT";

export const isOfflineMode = (isOnline: boolean, bushModeEnabled: boolean): boolean => {
  return !isOnline || bushModeEnabled;
};

export const getOfflinePlant = (plantId: string): OfflinePlant | undefined => {
  return offlinePlants.find((p) => p.id === plantId);
};

export const getBushMode = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(BUSH_MODE_KEY);
    return val === "true";
  } catch {
    return false;
  }
};

export const saveBushMode = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(BUSH_MODE_KEY, enabled ? "true" : "false");
  } catch {}
};

export const cacheLastPlant = async (plantData: object): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_PLANT_KEY, JSON.stringify(plantData));
  } catch {}
};

export const getLastCachedPlant = async (): Promise<object | null> => {
  try {
    const raw = await AsyncStorage.getItem(LAST_PLANT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const buildOfflinePlantResult = (plant: OfflinePlant) => ({
  identified: true,
  name_common: plant.name_common,
  name_scientific: plant.name_scientific,
  confidence: 1.0,
  safety_status: plant.safety_status,
  description: plant.africanKnowledge.uses,
  uses: plant.uses,
  warnings: plant.warnings,
  traditional_uses: plant.traditional_uses,
  local_names: plant.local_names,
  source: "offline",
});

export { offlinePlants };

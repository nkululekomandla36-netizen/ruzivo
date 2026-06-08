import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PendingPlant {
  id: string;
  imageUri: string | null;
  name_common: string;
  name_scientific: string;
  confidence: number;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
}

const KEY = "RUZIVO_PENDING_PLANTS_v1";

export async function getPendingPlants(): Promise<PendingPlant[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addPendingPlant(
  plant: Omit<PendingPlant, "status">
): Promise<void> {
  try {
    const all = await getPendingPlants();
    const isDuplicate = all.some(
      (p) =>
        p.name_scientific.toLowerCase() === plant.name_scientific.toLowerCase() ||
        p.name_common.toLowerCase() === plant.name_common.toLowerCase()
    );
    if (isDuplicate) return;
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify([{ ...plant, status: "pending" }, ...all].slice(0, 200))
    );
  } catch {}
}

export async function updatePendingStatus(
  id: string,
  status: "approved" | "rejected",
  notes?: string
): Promise<void> {
  try {
    const all = await getPendingPlants();
    const updated = all.map((p) =>
      p.id === id ? { ...p, status, notes: notes ?? p.notes } : p
    );
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export async function deletePendingPlant(id: string): Promise<void> {
  try {
    const all = await getPendingPlants();
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify(all.filter((p) => p.id !== id))
    );
  } catch {}
}

export async function getPendingCount(): Promise<number> {
  const all = await getPendingPlants();
  return all.filter((p) => p.status === "pending").length;
}

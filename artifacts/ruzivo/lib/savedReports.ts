import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SavedReport {
  id: string;
  savedAt: string;
  imageUri: string | null;
  plantData: Record<string, any>;
  knowledge: Record<string, any> | null;
}

const KEY = "RUZIVO_SAVED_REPORTS_v1";

export async function getSavedReports(): Promise<SavedReport[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveReport(report: SavedReport): Promise<void> {
  try {
    const all = await getSavedReports();
    const filtered = all.filter((r) => r.id !== report.id);
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify([report, ...filtered].slice(0, 100))
    );
  } catch {}
}

export async function deleteReport(id: string): Promise<void> {
  try {
    const all = await getSavedReports();
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify(all.filter((r) => r.id !== id))
    );
  } catch {}
}

export async function isReportSaved(id: string): Promise<boolean> {
  const all = await getSavedReports();
  return all.some((r) => r.id === id);
}

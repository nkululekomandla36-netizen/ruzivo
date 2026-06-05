import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { getRecentScans, type Scan } from "@/lib/database";
import {
  getSavedReports,
  deleteReport,
  type SavedReport,
} from "@/lib/savedReports";

type Tab = "history" | "saved";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("history");
  const [scans, setScans] = useState<Scan[]>([]);
  const [saved, setSaved] = useState<SavedReport[]>([]);
  const [query, setQuery] = useState("");

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const load = useCallback(async () => {
    const [s, r] = await Promise.all([getRecentScans(50), getSavedReports()]);
    setScans(s);
    setSaved(r);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredScans = scans.filter((s) =>
    (s.identified_name ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const filteredSaved = saved.filter((r) =>
    (r.plantData?.name_common ?? "")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const openScan = (scan: Scan) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (scan.plant_data_json) {
      router.push({
        pathname: "/result",
        params: {
          scanId: scan.id,
          imageUri: encodeURIComponent(scan.image_uri ?? ""),
          plantData: encodeURIComponent(scan.plant_data_json),
        },
      });
    } else {
      Alert.alert(
        "Full Report Unavailable",
        "This scan was saved before full report storage was enabled. Scan the plant again to get the full report."
      );
    }
  };

  const openSaved = (report: SavedReport) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/result",
      params: {
        scanId: report.id,
        imageUri: encodeURIComponent(report.imageUri ?? ""),
        plantData: encodeURIComponent(JSON.stringify(report.plantData)),
      },
    });
  };

  const removeSaved = (id: string, name: string) => {
    Alert.alert(
      "Remove Saved Plant",
      `Remove "${name}" from your saved plants?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await deleteReport(id);
            setSaved((prev) => prev.filter((r) => r.id !== id));
          },
        },
      ]
    );
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primary.white} />
        </Pressable>
        <Text style={styles.title}>
          {tab === "history" ? "Scan History" : "Saved Plants"}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, tab === "history" && styles.tabActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setTab("history");
          }}
        >
          <Feather
            name="clock"
            size={14}
            color={tab === "history" ? Colors.primary.black : Colors.primary.textMuted}
          />
          <Text style={[styles.tabText, tab === "history" && styles.tabTextActive]}>
            History
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === "saved" && styles.tabActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setTab("saved");
          }}
        >
          <Feather
            name="bookmark"
            size={14}
            color={tab === "saved" ? Colors.primary.black : Colors.primary.textMuted}
          />
          <Text style={[styles.tabText, tab === "saved" && styles.tabTextActive]}>
            Saved ({saved.length})
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <Feather name="search" size={16} color={Colors.primary.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search plants..."
          placeholderTextColor={Colors.primary.textMuted}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")}>
            <Feather name="x" size={16} color={Colors.primary.textMuted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: botPad + 24, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {tab === "history" &&
          (filteredScans.length === 0 ? (
            <EmptyState
              icon="clock"
              title="No scan history yet"
              subtitle="Your scanned plants will appear here"
            />
          ) : (
            filteredScans.map((scan) => (
              <Pressable
                key={scan.id}
                onPress={() => openScan(scan)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
              >
                {scan.image_uri ? (
                  <Image
                    source={{ uri: scan.image_uri }}
                    style={styles.thumbnail}
                  />
                ) : (
                  <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                    <Feather name="image" size={20} color={Colors.primary.textMuted} />
                  </View>
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.plantName} numberOfLines={1}>
                    {scan.identified_name ?? "Unknown Plant"}
                  </Text>
                  <Text style={styles.plantMeta}>
                    {scan.confidence_score
                      ? `${Math.round(scan.confidence_score * 100)}% confidence`
                      : "Unidentified"}
                  </Text>
                  <Text style={styles.plantDate}>{formatDate(scan.timestamp)}</Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={Colors.primary.textMuted}
                />
              </Pressable>
            ))
          ))}

        {tab === "saved" &&
          (filteredSaved.length === 0 ? (
            <EmptyState
              icon="bookmark"
              title="No saved plants yet"
              subtitle='Tap "Save Plant" on any scan result to save it here'
            />
          ) : (
            filteredSaved.map((report) => (
              <Pressable
                key={report.id}
                onPress={() => openSaved(report)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
              >
                {report.imageUri ? (
                  <Image
                    source={{ uri: report.imageUri }}
                    style={styles.thumbnail}
                  />
                ) : (
                  <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                    <Feather name="feather" size={20} color={Colors.primary.gold} />
                  </View>
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.plantName} numberOfLines={1}>
                    {report.plantData?.name_common ?? "Unknown"}
                  </Text>
                  <Text style={styles.plantMeta} numberOfLines={1}>
                    {report.plantData?.name_scientific ?? ""}
                  </Text>
                  <Text style={styles.plantDate}>
                    Saved {formatDate(report.savedAt)}
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    removeSaved(
                      report.id,
                      report.plantData?.name_common ?? "plant"
                    )
                  }
                  style={styles.deleteBtn}
                  hitSlop={10}
                >
                  <Feather name="trash-2" size={16} color={Colors.primary.caution} />
                </Pressable>
              </Pressable>
            ))
          ))}
      </ScrollView>
    </View>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Feather name={icon} size={32} color={Colors.primary.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.darkGreen,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary.separator,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.primary.gold,
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
  },
  tabTextActive: {
    color: Colors.primary.black,
    fontFamily: "Inter_600SemiBold",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  cardPressed: {
    opacity: 0.75,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  thumbnailPlaceholder: {
    backgroundColor: Colors.primary.separator,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  plantName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
  },
  plantMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    fontStyle: "italic",
  },
  plantDate: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted + "88",
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.primary.cardBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});

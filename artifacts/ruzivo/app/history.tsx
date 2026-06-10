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
import { getRecentScans, getAllPlants, addPlant, type Scan, type Plant } from "@/lib/database";
import {
  getSavedReports,
  deleteReport,
  type SavedReport,
} from "@/lib/savedReports";
import {
  getPendingPlants,
  updatePendingStatus,
  deletePendingPlant,
  type PendingPlant,
} from "@/lib/pendingPlants";

type Tab = "history" | "saved" | "pending";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("history");
  const [scans, setScans] = useState<Scan[]>([]);
  const [saved, setSaved] = useState<SavedReport[]>([]);
  const [pending, setPending] = useState<PendingPlant[]>([]);
  const [totalPlants, setTotalPlants] = useState(0);
  const [query, setQuery] = useState("");

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const load = useCallback(async () => {
    const [s, r, p, plants] = await Promise.all([
      getRecentScans(50),
      getSavedReports(),
      getPendingPlants(),
      getAllPlants(),
    ]);
    setScans(s);
    setSaved(r);
    setPending(p);
    setTotalPlants(plants.length);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pendingCount = pending.filter((p) => p.status === "pending").length;

  const filteredScans = scans.filter((s) =>
    (s.identified_name ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const filteredSaved = saved.filter((r) =>
    (r.plantData?.name_common ?? "")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const filteredPending = pending.filter(
    (p) =>
      p.name_common.toLowerCase().includes(query.toLowerCase()) ||
      p.name_scientific.toLowerCase().includes(query.toLowerCase())
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

  const handleApprovePending = (item: PendingPlant) => {
    Alert.alert(
      "Add to Library",
      `Add "${item.name_common}" to your Plant Library?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add to Library",
          onPress: async () => {
            await updatePendingStatus(item.id, "approved", "Approved by user review");
            setPending((prev) =>
              prev.map((p) => p.id === item.id ? { ...p, status: "approved" } : p)
            );

            const slug = item.name_scientific
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");

            const matchedScan = scans.find(
              (s) =>
                s.identified_name?.toLowerCase() === item.name_common.toLowerCase()
            );
            let scanPlantData: Record<string, any> | null = null;
            try {
              if (matchedScan?.plant_data_json) {
                scanPlantData = JSON.parse(matchedScan.plant_data_json);
              }
            } catch {}

            const matchedReport = saved.find(
              (r) =>
                r.plantData?.name_common?.toLowerCase() ===
                item.name_common.toLowerCase()
            );
            const reportPlantData = matchedReport?.plantData ?? null;

            const source = reportPlantData ?? scanPlantData;

            const plant: Plant = {
              id: slug || `user-${Date.now()}`,
              name_common: item.name_common,
              name_scientific: item.name_scientific,
              image_url: item.imageUri,
              safety_status:
                (source?.safety_status as Plant["safety_status"]) ?? "Safe",
              uses: source?.uses ?? [],
              warnings: source?.warnings ?? [],
              traditional_uses: source?.traditional_uses ?? [],
              local_names: source?.local_names ?? {},
            };

            await addPlant(plant);

            Alert.alert(
              "Added to Library",
              `"${item.name_common}" is now in your Plant Library.`
            );
          },
        },
      ]
    );
  };

  const handleRejectPending = (item: PendingPlant) => {
    Alert.alert(
      "Remove Discovery",
      `Remove "${item.name_common}" from new discoveries?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await deletePendingPlant(item.id);
            setPending((prev) => prev.filter((p) => p.id !== item.id));
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

  const getTabTitle = () => {
    if (tab === "history") return "Scan History";
    if (tab === "saved") return "Saved Plants";
    return "New Discoveries";
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
        <Text style={styles.title}>{getTabTitle()}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Feather name="database" size={12} color={Colors.primary.gold} />
          <Text style={styles.statText}>{totalPlants} Plants</Text>
        </View>
        <View style={styles.statPill}>
          <Feather name="clock" size={12} color={Colors.primary.textMuted} />
          <Text style={styles.statText}>{scans.length} Scans</Text>
        </View>
        <View style={styles.statPill}>
          <Feather name="bookmark" size={12} color={Colors.primary.textMuted} />
          <Text style={styles.statText}>{saved.length} Saved</Text>
        </View>
        {pendingCount > 0 && (
          <View style={[styles.statPill, styles.statPillNew]}>
            <Feather name="plus-circle" size={12} color={Colors.primary.darkGreen} />
            <Text style={[styles.statText, { color: Colors.primary.darkGreen }]}>
              {pendingCount} New
            </Text>
          </View>
        )}
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
            size={13}
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
            size={13}
            color={tab === "saved" ? Colors.primary.black : Colors.primary.textMuted}
          />
          <Text style={[styles.tabText, tab === "saved" && styles.tabTextActive]}>
            Saved ({saved.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === "pending" && styles.tabActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setTab("pending");
          }}
        >
          <Feather
            name="plus-circle"
            size={13}
            color={tab === "pending" ? Colors.primary.black : Colors.primary.textMuted}
          />
          <Text style={[styles.tabText, tab === "pending" && styles.tabTextActive]}>
            New{pendingCount > 0 ? ` (${pendingCount})` : ""}
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

        {tab === "pending" && (
          <>
            {filteredPending.length === 0 ? (
              <EmptyState
                icon="plus-circle"
                title="No new discoveries yet"
                subtitle="Plants not found in your local library will appear here after scanning"
              />
            ) : (
              <>
                <View style={styles.pendingInfo}>
                  <Feather name="info" size={13} color={Colors.primary.textMuted} />
                  <Text style={styles.pendingInfoText}>
                    These plants were identified but are not yet in your library. Tap ✓ to add them to your Plant Library.
                  </Text>
                </View>
                {filteredPending.map((item) => (
                  <View key={item.id} style={styles.card}>
                    {item.imageUri ? (
                      <Image
                        source={{ uri: item.imageUri }}
                        style={styles.thumbnail}
                      />
                    ) : (
                      <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                        <Feather name="eye" size={20} color={Colors.primary.textMuted} />
                      </View>
                    )}
                    <View style={styles.cardContent}>
                      <View style={styles.pendingNameRow}>
                        <Text style={styles.plantName} numberOfLines={1}>
                          {item.name_common}
                        </Text>
                        <View style={[
                          styles.statusBadge,
                          item.status === "approved" && styles.statusBadgeApproved,
                          item.status === "rejected" && styles.statusBadgeRejected,
                        ]}>
                          <Text style={[
                            styles.statusBadgeText,
                            item.status === "approved" && styles.statusBadgeTextApproved,
                          ]}>
                            {item.status === "pending" ? "New" : item.status === "approved" ? "✓ In Library" : "Removed"}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.plantMeta} numberOfLines={1}>
                        {item.name_scientific}
                      </Text>
                      <Text style={styles.plantDate}>
                        {Math.round(item.confidence * 100)}% confidence · {formatDate(item.timestamp)}
                      </Text>
                    </View>
                    {item.status === "pending" && (
                      <View style={styles.pendingActions}>
                        <Pressable
                          onPress={() => handleApprovePending(item)}
                          style={styles.approveBtn}
                          hitSlop={6}
                        >
                          <Feather name="check" size={14} color={Colors.primary.safe} />
                        </Pressable>
                        <Pressable
                          onPress={() => handleRejectPending(item)}
                          style={styles.rejectBtn}
                          hitSlop={6}
                        >
                          <Feather name="trash-2" size={14} color={Colors.primary.caution} />
                        </Pressable>
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </>
        )}
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
    paddingBottom: 12,
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
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  statPillNew: {
    backgroundColor: Colors.primary.gold,
    borderColor: Colors.primary.gold,
  },
  statText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 10,
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
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.primary.gold,
  },
  tabText: {
    fontSize: 12,
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
    marginTop: 10,
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
    marginTop: 10,
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
    width: 52,
    height: 52,
    borderRadius: 10,
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
    fontSize: 14,
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
  pendingInfo: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    alignItems: "flex-start",
  },
  pendingInfoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    lineHeight: 18,
  },
  pendingNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusBadge: {
    backgroundColor: Colors.primary.gold + "33",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusBadgeApproved: {
    backgroundColor: Colors.primary.safe + "33",
  },
  statusBadgeRejected: {
    backgroundColor: Colors.primary.separator,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
  },
  statusBadgeTextApproved: {
    color: Colors.primary.safe,
  },
  pendingActions: {
    gap: 8,
    alignItems: "center",
  },
  approveBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.primary.safe + "22",
    alignItems: "center",
    justifyContent: "center",
  },
  rejectBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.primary.caution + "22",
    alignItems: "center",
    justifyContent: "center",
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

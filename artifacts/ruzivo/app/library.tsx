import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import {
  Plant,
  getAllPlants,
  searchPlants,
  getPlantsByFilter,
} from "@/lib/database";
import { PlantCard } from "@/components/PlantCard";
import { useDatabase } from "@/context/DatabaseContext";

type FilterType = "All" | "Medicinal" | "Toxic" | "Food";

const FILTERS: FilterType[] = ["All", "Medicinal", "Toxic", "Food"];

const FILTER_ICONS: Record<FilterType, keyof typeof Feather.glyphMap> = {
  All: "list",
  Medicinal: "activity",
  Toxic: "alert-triangle",
  Food: "coffee",
};

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { isReady } = useDatabase();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [isLoading, setIsLoading] = useState(true);

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const loadPlants = useCallback(async () => {
    if (!isReady) return;
    setIsLoading(true);
    try {
      let result: Plant[];
      if (searchQuery.trim()) {
        result = await searchPlants(searchQuery.trim());
      } else if (activeFilter === "All") {
        result = await getAllPlants();
      } else {
        result = await getPlantsByFilter(
          activeFilter as "Medicinal" | "Toxic" | "Food"
        );
      }
      setPlants(result);
    } catch (err) {
      console.error("Load plants error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isReady, searchQuery, activeFilter]);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  const handleFilterPress = (filter: FilterType) => {
    Haptics.selectionAsync();
    setActiveFilter(filter);
    setSearchQuery("");
  };

  const handlePlantPress = (plant: Plant) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/plant/[id]", params: { id: plant.id } });
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primary.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Plant Library</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{plants.length}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={Colors.primary.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search plants..."
          placeholderTextColor={Colors.primary.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Feather name="x" size={16} color={Colors.primary.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => handleFilterPress(filter)}
            style={({ pressed }) => [
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Feather
              name={FILTER_ICONS[filter]}
              size={13}
              color={
                activeFilter === filter
                  ? Colors.primary.black
                  : Colors.primary.textMuted
              }
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={Colors.primary.gold} size="large" />
          <Text style={styles.loadingText}>Loading plants...</Text>
        </View>
      ) : plants.length === 0 ? (
        <View style={styles.centerState}>
          <View style={styles.emptyIcon}>
            <Feather name="search" size={32} color={Colors.primary.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No plants found</Text>
          <Text style={styles.emptySubtitle}>Try a different search or filter</Text>
        </View>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlantCard plant={item} onPress={() => handlePlantPress(item)} />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: botPad + 16 }]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!plants.length}
        />
      )}
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
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary.cardBg,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
  },
  countBadge: {
    backgroundColor: Colors.primary.gold + "30",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary.gold + "50",
  },
  countText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.gold,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.cardBg,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.primary.cardBg,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  filterChipActive: {
    backgroundColor: Colors.primary.gold,
    borderColor: Colors.primary.gold,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
  },
  filterTextActive: {
    color: Colors.primary.black,
    fontFamily: "Inter_600SemiBold",
  },
  list: {
    paddingHorizontal: 20,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: Colors.primary.cardBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    marginTop: 8,
  },
});

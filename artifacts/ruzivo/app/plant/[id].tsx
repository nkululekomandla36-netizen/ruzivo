import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { Plant, getPlantById } from "@/lib/database";
import { SafetyBadge } from "@/components/SafetyBadge";

const PLANT_COLORS: Record<string, string> = {
  "aloe-vera": "#2ECC71",
  moringa: "#27AE60",
  neem: "#16A085",
  rooibos: "#E74C3C",
  "african-potato": "#8E44AD",
};

const PLANT_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  "aloe-vera": "droplet",
  moringa: "sun",
  neem: "shield",
  rooibos: "coffee",
  "african-potato": "circle",
};

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  useEffect(() => {
    if (!id) return;
    getPlantById(id)
      .then(setPlant)
      .finally(() => setIsLoading(false));
  }, [id]);

  const accentColor = id ? PLANT_COLORS[id] || Colors.primary.darkGreen : Colors.primary.darkGreen;
  const iconName = id ? PLANT_ICONS[id] || "feather" : "feather";

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={Colors.primary.gold} size="large" />
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Feather name="alert-circle" size={40} color={Colors.primary.textMuted} />
        <Text style={styles.errorText}>Plant not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <LinearGradient
        colors={["#051A13", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primary.white} />
        </Pressable>
        <Text style={styles.headerLabel}>Plant Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 24 }]}
      >
        <View style={styles.heroCard}>
          <LinearGradient
            colors={[accentColor + "33", accentColor + "11"]}
            style={styles.heroCardGradient}
          >
            <View style={[styles.plantIcon, { backgroundColor: accentColor + "30" }]}>
              <Feather name={iconName} size={48} color={accentColor} />
            </View>
            <View style={styles.heroInfo}>
              <SafetyBadge status={plant.safety_status} size="large" />
              <Text style={styles.commonName}>{plant.name_common}</Text>
              <Text style={styles.scientificName}>{plant.name_scientific}</Text>
            </View>
          </LinearGradient>
        </View>

        <SectionCard
          icon="activity"
          title="Uses"
          color={Colors.primary.safe}
          items={plant.uses}
          listStyle="bullet"
        />

        <SectionCard
          icon="alert-triangle"
          title="Warnings"
          color={Colors.primary.caution}
          items={plant.warnings}
          listStyle="bullet"
        />

        <SectionCard
          icon="globe"
          title="Traditional African Uses"
          color={Colors.primary.gold}
          items={plant.traditional_uses}
          listStyle="numbered"
        />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBg, { backgroundColor: Colors.primary.lightGreen + "33" }]}>
              <Feather name="map-pin" size={16} color={Colors.primary.lightGreen} />
            </View>
            <Text style={styles.cardTitle}>Local Names</Text>
          </View>
          <View style={styles.localNamesGrid}>
            {Object.entries(plant.local_names).map(([lang, name]) => (
              <View key={lang} style={styles.localNameItem}>
                <Text style={styles.localNameLang}>{lang}</Text>
                <Text style={styles.localNameValue}>{name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.disclaimerBox}>
          <Feather name="info" size={14} color={Colors.primary.textMuted} />
          <Text style={styles.disclaimerText}>
            This information is for educational purposes only. Always consult a
            qualified healthcare professional before using any plant medicinally.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionCard({
  icon,
  title,
  color,
  items,
  listStyle,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  color: string;
  items: string[];
  listStyle: "bullet" | "numbered";
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconBg, { backgroundColor: color + "22" }]}>
          <Feather name={icon} size={16} color={color} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          {listStyle === "numbered" ? (
            <View style={[styles.numberBadge, { backgroundColor: color + "22" }]}>
              <Text style={[styles.numberText, { color }]}>{index + 1}</Text>
            </View>
          ) : (
            <View style={[styles.bullet, { backgroundColor: color }]} />
          )}
          <Text style={styles.listItemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.black,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
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
  headerLabel: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingTop: 4,
  },
  heroCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    marginBottom: 4,
  },
  heroCardGradient: {
    padding: 24,
    alignItems: "center",
    gap: 16,
  },
  plantIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  heroInfo: {
    alignItems: "center",
    gap: 8,
  },
  commonName: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.white,
    textAlign: "center",
  },
  scientificName: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    fontStyle: "italic",
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 2,
  },
  cardIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  numberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  numberText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
    lineHeight: 20,
  },
  localNamesGrid: {
    gap: 8,
  },
  localNameItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary.separator,
    borderRadius: 10,
  },
  localNameLang: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
  },
  localNameValue: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
    fontStyle: "italic",
  },
  disclaimerBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    backgroundColor: Colors.primary.separator,
    borderRadius: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
  },
  backLink: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backLinkText: {
    color: Colors.primary.gold,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});

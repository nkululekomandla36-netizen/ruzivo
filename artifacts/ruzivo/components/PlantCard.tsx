import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafetyBadge } from "@/components/SafetyBadge";
import { Plant } from "@/lib/database";
import Colors from "@/constants/colors";

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
  style?: ViewStyle;
}

const PLANT_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  "aloe-vera": "droplet",
  moringa: "sun",
  neem: "shield",
  rooibos: "coffee",
  "african-potato": "circle",
};

const PLANT_COLORS: Record<string, string> = {
  "aloe-vera": "#2ECC71",
  moringa: "#27AE60",
  neem: "#16A085",
  rooibos: "#E74C3C",
  "african-potato": "#8E44AD",
};

export function PlantCard({ plant, onPress, style }: PlantCardProps) {
  const iconName = PLANT_ICONS[plant.id] || "feather";
  const accentColor = PLANT_COLORS[plant.id] || Colors.primary.darkGreen;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: accentColor + "22" }]}>
        <Feather name={iconName} size={26} color={accentColor} />
      </View>
      <View style={styles.info}>
        <Text style={styles.commonName}>{plant.name_common}</Text>
        <Text style={styles.scientificName} numberOfLines={1}>
          {plant.name_scientific}
        </Text>
        <View style={styles.footer}>
          <SafetyBadge status={plant.safety_status} />
          <Text style={styles.usesCount}>{plant.uses.length} uses</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={Colors.primary.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  commonName: {
    color: Colors.primary.white,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  scientificName: {
    color: Colors.primary.textMuted,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  usesCount: {
    color: Colors.primary.textMuted,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});

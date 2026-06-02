import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface PlantKnowledgeCardProps {
  title: string;
  items?: string[];
  icon?: keyof typeof Feather.glyphMap;
  color?: string;
}

const PlantKnowledgeCard = ({
  title,
  items,
  icon,
  color = Colors.primary.gold,
}: PlantKnowledgeCardProps) => {
  if (!items || items.length === 0) return null;

  const combined = items.map((item) => `• ${item}`).join("\n");

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {icon ? (
          <View style={[styles.iconBg, { backgroundColor: color + "22" }]}>
            <Feather name={icon} size={16} color={color} />
          </View>
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text selectable style={styles.items}>
        {combined}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 2,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
  },
  items: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
    lineHeight: 24,
  },
});

export default PlantKnowledgeCard;

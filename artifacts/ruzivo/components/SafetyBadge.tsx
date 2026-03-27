import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

type SafetyStatus = "Safe" | "Caution" | "Toxic";

interface SafetyBadgeProps {
  status: SafetyStatus;
  size?: "small" | "large";
}

const config: Record<
  SafetyStatus,
  { color: string; icon: keyof typeof Feather.glyphMap; label: string }
> = {
  Safe: {
    color: Colors.primary.safe,
    icon: "check-circle",
    label: "Safe",
  },
  Caution: {
    color: Colors.primary.caution,
    icon: "alert-triangle",
    label: "Caution",
  },
  Toxic: {
    color: Colors.primary.toxic,
    icon: "x-circle",
    label: "Toxic",
  },
};

export function SafetyBadge({ status, size = "small" }: SafetyBadgeProps) {
  const { color, icon, label } = config[status] || config["Caution"];
  const isLarge = size === "large";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + "22", borderColor: color },
        isLarge && styles.badgeLarge,
      ]}
    >
      <Feather
        name={icon}
        size={isLarge ? 16 : 12}
        color={color}
        style={{ marginRight: 4 }}
      />
      <Text
        style={[
          styles.text,
          { color },
          isLarge && styles.textLarge,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeLarge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  text: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
  textLarge: {
    fontSize: 14,
  },
});

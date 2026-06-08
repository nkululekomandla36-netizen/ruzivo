import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useDatabase } from "@/context/DatabaseContext";
import { getAllPlants } from "@/lib/database";
import { getBushMode, saveBushMode } from "@/lib/offlineService";
import PlantGallery from "@/components/PlantGallery";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isReady } = useDatabase();
  const [plantCount, setPlantCount] = useState(0);
  const [bushMode, setBushModeState] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    getAllPlants().then((plants) => setPlantCount(plants.length)).catch(() => {});
  }, [isReady]);

  useEffect(() => {
    getBushMode().then(setBushModeState);
  }, []);

  const toggleBushMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = !bushMode;
    setBushModeState(next);
    saveBushMode(next);
  };

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const handleScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/scan");
  };

  const handleLibrary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/library");
  };

  const handleHistory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/history");
  };

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: botPad }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Feather name="feather" size={28} color={Colors.primary.gold} />
          <Text style={styles.appTitle}>RUZIVO</Text>
        </View>
        <Text style={styles.tagline}>Plant Knowledge. Offline First.</Text>
      </View>

      <View style={styles.heroSection}>
        <PlantGallery />
        <Text style={styles.heroTitle}>Discover the{"\n"}Power of Plants</Text>
        <Text style={styles.heroSubtitle}>
          Identify, learn and explore African botanical knowledge — even without internet.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={handleScan}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <View style={styles.primaryButtonInner}>
            <View style={styles.buttonIcon}>
              <Feather name="camera" size={22} color={Colors.primary.black} />
            </View>
            <Text style={styles.primaryButtonText}>Scan Plant</Text>
            <Feather name="arrow-right" size={18} color={Colors.primary.black} />
          </View>
        </Pressable>

        <Pressable
          onPress={handleLibrary}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <View style={styles.buttonIcon}>
            <Feather name="book-open" size={22} color={Colors.primary.gold} />
          </View>
          <Text style={styles.secondaryButtonText}>Plant Library</Text>
          <Feather name="arrow-right" size={18} color={Colors.primary.gold} />
        </Pressable>

        <Pressable
          onPress={handleHistory}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <View style={styles.buttonIcon}>
            <Feather name="clock" size={22} color={Colors.primary.gold} />
          </View>
          <Text style={styles.secondaryButtonText}>Scan History</Text>
          <Feather name="arrow-right" size={18} color={Colors.primary.gold} />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StatItem icon="database" label={plantCount > 0 ? `${plantCount} Plants` : "35 Plants"} />
        <View style={styles.statDivider} />
        <StatItem icon="wifi-off" label="Offline Ready" />
        <View style={styles.statDivider} />
        <StatItem icon="map-pin" label="African Focus" />
      </View>

      <Pressable
        onPress={toggleBushMode}
        style={({ pressed }) => [
          styles.bushModeToggle,
          bushMode && styles.bushModeToggleActive,
          pressed && styles.buttonPressed,
        ]}
      >
        <View style={styles.bushModeLeft}>
          <Text style={styles.bushModeEmoji}>🌿</Text>
          <View>
            <Text style={[styles.bushModeLabel, bushMode && styles.bushModeLabelActive]}>
              Bush Mode
            </Text>
            <Text style={styles.bushModeDesc}>
              {bushMode
                ? "ON — Offline plant picker from 35 local plants"
                : "OFF — Live plant identification active"}
            </Text>
          </View>
        </View>
        <View style={[styles.bushModeIndicator, bushMode && styles.bushModeIndicatorActive]}>
          <View style={[styles.bushModeKnob, bushMode && styles.bushModeKnobActive]} />
        </View>
      </Pressable>

      <Text style={styles.disclaimer}>
        For educational purposes only. Not a substitute for medical advice.
      </Text>
    </View>
  );
}

function StatItem({
  icon,
  label,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.statItem}>
      <Feather name={icon} size={14} color={Colors.primary.gold} />
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.darkGreen,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 16,
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.white,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    letterSpacing: 0.5,
  },
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  heroTitle: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.white,
    textAlign: "center",
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  actions: {
    gap: 10,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.primary.gold,
  },
  primaryButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.primary.gold + "60",
    backgroundColor: Colors.primary.gold + "10",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary.black + "30",
  },
  primaryButtonText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.black,
    flex: 1,
    textAlign: "center",
  },
  secondaryButtonText: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.gold,
    flex: 1,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.primary.separator,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
  },
  disclaimer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted + "88",
    textAlign: "center",
    marginBottom: 8,
  },
  bushModeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  bushModeToggleActive: {
    borderColor: Colors.primary.gold + "60",
    backgroundColor: Colors.primary.gold + "10",
  },
  bushModeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  bushModeEmoji: {
    fontSize: 22,
  },
  bushModeLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.textMuted,
  },
  bushModeLabelActive: {
    color: Colors.primary.gold,
  },
  bushModeDesc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted + "99",
    marginTop: 2,
  },
  bushModeIndicator: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary.separator,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  bushModeIndicatorActive: {
    backgroundColor: Colors.primary.gold,
  },
  bushModeKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.textMuted,
    alignSelf: "flex-start",
  },
  bushModeKnobActive: {
    backgroundColor: Colors.primary.black,
    alignSelf: "flex-end",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Image,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

export default function ResultScreen() {
  const { scanId, imageUri } = useLocalSearchParams<{
    scanId: string;
    imageUri: string;
  }>();
  const insets = useSafeAreaInsets();

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const handleGoLibrary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/library");
  };

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/scan");
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <LinearGradient
        colors={["#051A13", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primary.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Scan Result</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 24 }]}
      >
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: decodeURIComponent(imageUri) }}
              style={styles.plantImage}
              resizeMode="cover"
            />
            <View style={styles.imageBadge}>
              <Feather name="image" size={12} color={Colors.primary.gold} />
              <Text style={styles.imageBadgeText}>Captured</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.statusCard}>
          <View style={styles.statusIconRow}>
            <View style={styles.statusIconBg}>
              <Feather name="wifi-off" size={28} color={Colors.primary.gold} />
            </View>
          </View>
          <Text style={styles.statusTitle}>Identification Unavailable</Text>
          <Text style={styles.statusSubtitle}>
            Plant identification requires an internet connection. Your image has
            been saved locally.
          </Text>

          <View style={styles.offlineNote}>
            <Feather name="info" size={14} color={Colors.primary.textMuted} />
            <Text style={styles.offlineNoteText}>
              In a future version, offline AI scanning will be available using
              on-device machine learning.
            </Text>
          </View>
        </View>

        <Text style={styles.suggestTitle}>Try the Plant Library instead</Text>
        <Text style={styles.suggestSubtitle}>
          Browse and search through our curated database of African plants —
          fully offline.
        </Text>

        <View style={styles.quickLinks}>
          <QuickLink
            icon="droplet"
            label="Aloe Vera"
            onPress={() => {
              Haptics.selectionAsync();
              router.push({ pathname: "/plant/[id]", params: { id: "aloe-vera" } });
            }}
          />
          <QuickLink
            icon="sun"
            label="Moringa"
            onPress={() => {
              Haptics.selectionAsync();
              router.push({ pathname: "/plant/[id]", params: { id: "moringa" } });
            }}
          />
          <QuickLink
            icon="shield"
            label="Neem"
            onPress={() => {
              Haptics.selectionAsync();
              router.push({ pathname: "/plant/[id]", params: { id: "neem" } });
            }}
          />
          <QuickLink
            icon="coffee"
            label="Rooibos"
            onPress={() => {
              Haptics.selectionAsync();
              router.push({ pathname: "/plant/[id]", params: { id: "rooibos" } });
            }}
          />
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleRetry}
            style={({ pressed }) => [
              styles.retryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Feather name="camera" size={18} color={Colors.primary.gold} />
            <Text style={styles.retryBtnText}>Scan Again</Text>
          </Pressable>

          <Pressable
            onPress={handleGoLibrary}
            style={({ pressed }) => [
              styles.libraryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <LinearGradient
              colors={[Colors.primary.gold, "#A8841E"]}
              style={styles.libraryBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name="book-open" size={18} color={Colors.primary.black} />
              <Text style={styles.libraryBtnText}>Open Library</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          This information is for educational purposes only.
        </Text>
      </ScrollView>
    </View>
  );
}

function QuickLink({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.quickLink, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.quickLinkIcon}>
        <Feather name={icon} size={20} color={Colors.primary.gold} />
      </View>
      <Text style={styles.quickLinkLabel}>{label}</Text>
      <Feather name="chevron-right" size={14} color={Colors.primary.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.black,
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
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  plantImage: {
    width: "100%",
    height: 240,
    borderRadius: 20,
  },
  imageBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.primary.black + "AA",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  imageBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
  },
  statusCard: {
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  statusIconRow: {
    marginBottom: 4,
  },
  statusIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.primary.gold + "20",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary.gold + "30",
  },
  statusTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.white,
    textAlign: "center",
  },
  statusSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  offlineNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.primary.separator,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    width: "100%",
  },
  offlineNoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    lineHeight: 18,
  },
  suggestTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
  },
  suggestSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    lineHeight: 18,
    marginTop: -8,
  },
  quickLinks: {
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  quickLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary.separator,
  },
  quickLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary.gold + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  quickLinkLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.white,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  retryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary.gold + "50",
    backgroundColor: Colors.primary.gold + "10",
  },
  retryBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.gold,
  },
  libraryBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  libraryBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  libraryBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.black,
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  disclaimer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted + "88",
    textAlign: "center",
    paddingBottom: 8,
  },
});

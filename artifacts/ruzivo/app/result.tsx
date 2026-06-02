import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { SafetyBadge } from "@/components/SafetyBadge";
import {
  fetchPlantKnowledge,
  type PlantKnowledge,
} from "@/lib/plantKnowledgeService";
import PlantKnowledgeCard from "@/components/PlantKnowledgeCard";
import { findLocalKnowledge } from "@/lib/traditionalKnowledge";

interface PlantData {
  identified: boolean;
  name_common: string;
  name_scientific: string;
  confidence: number;
  safety_status: "Safe" | "Caution" | "Toxic";
  uses: string[];
  warnings: string[];
  traditional_uses: string[];
  local_names: Record<string, string>;
  description: string;
}

export default function ResultScreen() {
  const { scanId, imageUri, plantData: plantDataRaw } =
    useLocalSearchParams<{
      scanId: string;
      imageUri: string;
      plantData: string;
    }>();
  const insets = useSafeAreaInsets();
  const [knowledge, setKnowledge] = useState<PlantKnowledge | null>(null);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [knowledgeExpanded, setKnowledgeExpanded] = useState(false);

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  let plantData: PlantData | null = null;
  try {
    if (plantDataRaw) {
      plantData = JSON.parse(decodeURIComponent(plantDataRaw)) as PlantData;
    }
  } catch {}

  useEffect(() => {
    if (!plantData?.identified) return;
    setKnowledgeLoading(true);
    fetchPlantKnowledge(
      plantData.name_common,
      plantData.name_scientific,
      plantData.safety_status
    )
      .then(setKnowledge)
      .finally(() => setKnowledgeLoading(false));
  }, [plantDataRaw]);

  const decodedUri = imageUri ? decodeURIComponent(imageUri) : null;
  const confidence = plantData?.confidence ?? 0;
  const confidencePercent = Math.round(confidence * 100);

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/scan");
  };

  const handleLibrary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/library");
  };

  if (!plantData || !plantData.identified) {
    return (
      <UnidentifiedResult
        imageUri={decodedUri}
        topPad={topPad}
        botPad={botPad}
        onRetry={handleRetry}
        onLibrary={handleLibrary}
      />
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primary.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Result</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 24 }]}
      >
        {decodedUri ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: decodedUri }}
              style={styles.plantImage}
              resizeMode="cover"
            />
            <View style={styles.imageBadge}>
              <Feather name="zap" size={12} color={Colors.primary.gold} />
              <Text style={styles.imageBadgeText}>Identified</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.identityCard}>
          <View style={styles.identityTop}>
            <View style={styles.identityNames}>
              <Text selectable style={styles.commonName}>{plantData.name_common}</Text>
              <Text selectable style={styles.scientificName}>{plantData.name_scientific}</Text>
            </View>
            <SafetyBadge status={plantData.safety_status} size="large" />
          </View>

          {plantData.description ? (
            <Text selectable style={styles.description}>{plantData.description}</Text>
          ) : null}

          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceLabel}>Confidence</Text>
            <View style={styles.confidenceBarTrack}>
              <View
                style={[
                  styles.confidenceBarFill,
                  {
                    width: `${confidencePercent}%` as any,
                    backgroundColor:
                      confidence > 0.7
                        ? Colors.primary.safe
                        : confidence > 0.4
                          ? Colors.primary.caution
                          : Colors.primary.toxic,
                  },
                ]}
              />
            </View>
            <Text style={styles.confidenceValue}>{confidencePercent}%</Text>
          </View>
        </View>

        {plantData.uses && plantData.uses.length > 0 && (
          <ResultSection
            icon="activity"
            title="Uses"
            color={Colors.primary.safe}
            items={plantData.uses}
          />
        )}

        {plantData.warnings && plantData.warnings.length > 0 && (
          <ResultSection
            icon="alert-triangle"
            title="Warnings"
            color={Colors.primary.caution}
            items={plantData.warnings}
          />
        )}

        {plantData.traditional_uses && plantData.traditional_uses.length > 0 && (
          <ResultSection
            icon="globe"
            title="Traditional African Uses"
            color={Colors.primary.gold}
            items={plantData.traditional_uses}
          />
        )}

        {plantData.local_names &&
          Object.keys(plantData.local_names).length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBg, { backgroundColor: Colors.primary.lightGreen + "33" }]}>
                  <Feather name="map-pin" size={16} color={Colors.primary.lightGreen} />
                </View>
                <Text style={styles.cardTitle}>Local Names</Text>
              </View>
              {Object.entries(plantData.local_names).map(([lang, name]) => (
                <View key={lang} style={styles.localNameRow}>
                  <Text selectable style={styles.localLang}>{lang}</Text>
                  <Text selectable style={styles.localName}>{name}</Text>
                </View>
              ))}
            </View>
          )}

        {(() => {
          const local = findLocalKnowledge(
            plantData.name_common,
            plantData.name_scientific
          );
          const trad = knowledge?.traditional_knowledge ?? local?.traditionalKnowledge ?? [];
          const uses = knowledge?.medicinal_cultural_uses ?? local?.traditionalUses ?? [];
          const safety = knowledge?.safety_information ?? local?.safetyNotes ?? [];
          const eco = knowledge?.habitat_ecology ?? local?.ecology ?? [];
          const cons = knowledge?.conservation_notes ?? local?.conservation ?? [];
          const overview = knowledge?.overview ?? null;
          const hasAny =
            trad.length > 0 ||
            uses.length > 0 ||
            safety.length > 0 ||
            eco.length > 0 ||
            cons.length > 0 ||
            !!overview;

          if (!hasAny && !knowledgeLoading) return null;

          return (
            <>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setKnowledgeExpanded((v) => !v);
                }}
                style={({ pressed }) => [
                  styles.knowledgeToggle,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <View style={styles.knowledgeToggleLeft}>
                  <View style={styles.knowledgeToggleIcon}>
                    <Text style={styles.knowledgeToggleEmoji}>🌍</Text>
                  </View>
                  <Text style={styles.knowledgeToggleLabel}>
                    African Plant Knowledge
                  </Text>
                </View>
                {knowledgeLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary.gold} />
                ) : (
                  <Feather
                    name={knowledgeExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={Colors.primary.gold}
                  />
                )}
              </Pressable>

              {knowledgeExpanded && (
                <>
                  {overview ? (
                    <View style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={[styles.cardIconBg, { backgroundColor: Colors.primary.gold + "22" }]}>
                          <Feather name="book" size={16} color={Colors.primary.gold} />
                        </View>
                        <Text style={styles.cardTitle}>Plant Overview</Text>
                      </View>
                      <Text selectable style={styles.overviewText}>{overview}</Text>
                    </View>
                  ) : null}

                  <PlantKnowledgeCard
                    title="Traditional Knowledge"
                    items={trad}
                    icon="sun"
                    color={Colors.primary.gold}
                  />
                  <PlantKnowledgeCard
                    title="Traditional Uses"
                    items={uses}
                    icon="heart"
                    color={Colors.primary.safe}
                  />
                  <PlantKnowledgeCard
                    title="Safety Notes"
                    items={safety}
                    icon="shield"
                    color={Colors.primary.caution}
                  />
                  <PlantKnowledgeCard
                    title="Ecology & Habitat"
                    items={eco}
                    icon="compass"
                    color={Colors.primary.lightGreen}
                  />
                  <PlantKnowledgeCard
                    title="Conservation Notes"
                    items={cons}
                    icon="feather"
                    color={Colors.primary.textMuted}
                  />
                </>
              )}
            </>
          );
        })()}

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleRetry}
            style={({ pressed }) => [styles.retryBtn, pressed && styles.btnPressed]}
          >
            <Feather name="camera" size={18} color={Colors.primary.gold} />
            <Text style={styles.retryBtnText}>Scan Again</Text>
          </Pressable>

          <Pressable
            onPress={handleLibrary}
            style={({ pressed }) => [styles.libraryBtn, pressed && styles.btnPressed]}
          >
            <View style={styles.libraryBtnInner}>
              <Feather name="book-open" size={18} color={Colors.primary.black} />
              <Text style={styles.libraryBtnText}>Plant Library</Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          This information is for educational purposes only. Always consult a
          qualified professional before using any plant medicinally.
        </Text>
      </ScrollView>
    </View>
  );
}

function ResultSection({
  icon,
  title,
  color,
  items,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  color: string;
  items: string[];
}) {
  const combined = items.map((item) => `• ${item}`).join("\n");
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconBg, { backgroundColor: color + "22" }]}>
          <Feather name={icon} size={16} color={color} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text selectable style={[styles.listItemText, { lineHeight: 24 }]}>
        {combined}
      </Text>
    </View>
  );
}

function UnidentifiedResult({
  imageUri,
  topPad,
  botPad,
  onRetry,
  onLibrary,
}: {
  imageUri: string | null;
  topPad: number;
  botPad: number;
  onRetry: () => void;
  onLibrary: () => void;
}) {
  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primary.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Result</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: botPad + 24 }]}>
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.plantImage} resizeMode="cover" />
          </View>
        ) : null}
        <View style={[styles.card, { alignItems: "center", gap: 12 }]}>
          <View style={styles.unidentifiedIcon}>
            <Feather name="help-circle" size={32} color={Colors.primary.textMuted} />
          </View>
          <Text style={[styles.commonName, { textAlign: "center", fontSize: 20 }]}>
            Plant Not Identified
          </Text>
          <Text style={[styles.description, { textAlign: "center" }]}>
            Could not identify a plant in this image. Try a clearer photo with better lighting and focus on the plant.
          </Text>
        </View>
        <View style={styles.actionsRow}>
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [styles.retryBtn, pressed && styles.btnPressed]}
          >
            <Feather name="camera" size={18} color={Colors.primary.gold} />
            <Text style={styles.retryBtnText}>Try Again</Text>
          </Pressable>
          <Pressable
            onPress={onLibrary}
            style={({ pressed }) => [styles.libraryBtn, pressed && styles.btnPressed]}
          >
            <View style={styles.libraryBtnInner}>
              <Feather name="book-open" size={18} color={Colors.primary.black} />
              <Text style={styles.libraryBtnText}>Browse Library</Text>
            </View>
          </Pressable>
        </View>
        <Text style={styles.disclaimer}>This information is for educational purposes only.</Text>
      </ScrollView>
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
  content: {
    paddingHorizontal: 20,
    gap: 12,
    paddingTop: 4,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    height: 220,
  },
  plantImage: {
    width: "100%",
    height: "100%",
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
  identityCard: {
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    gap: 12,
  },
  identityTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  identityNames: {
    flex: 1,
    gap: 4,
  },
  commonName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.white,
  },
  scientificName: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    fontStyle: "italic",
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    lineHeight: 20,
  },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  confidenceLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
    width: 72,
  },
  confidenceBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.primary.separator,
    borderRadius: 3,
    overflow: "hidden",
  },
  confidenceBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  confidenceValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
    width: 36,
    textAlign: "right",
  },
  card: {
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    gap: 10,
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
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
    lineHeight: 20,
  },
  localNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary.separator,
    borderRadius: 10,
  },
  localLang: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
  },
  localName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
    fontStyle: "italic",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
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
    backgroundColor: Colors.primary.gold,
  },
  libraryBtnInner: {
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
  unidentifiedIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.primary.textMuted + "20",
    alignItems: "center",
    justifyContent: "center",
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
  knowledgeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary.gold + "40",
  },
  knowledgeToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  knowledgeToggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary.gold + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  knowledgeToggleEmoji: {
    fontSize: 18,
  },
  knowledgeToggleLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.gold,
  },
  knowledgeLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  knowledgeLoadingText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
  },
  overviewText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
    lineHeight: 22,
  },
});

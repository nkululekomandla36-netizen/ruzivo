import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  ToastAndroid,
  Share,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Colors from "@/constants/colors";
import { SafetyBadge } from "@/components/SafetyBadge";
import {
  copyReportToClipboard,
  shareReport,
} from "@/lib/reportExport";

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ??
  `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

type ScreenState = "idle" | "preview" | "analysing" | "results";
type AnalyseStep = "reading" | "analysing" | "processing";

const STEP_LABELS: Record<AnalyseStep, string> = {
  reading: "Reading image...",
  analysing: "Analysing plant health...",
  processing: "Processing results...",
};

interface HealthData {
  problem_identified: boolean;
  plant_name: string;
  condition_name: string;
  severity: "Mild" | "Moderate" | "Severe";
  description: string;
  symptoms: string[];
  natural_treatments: string[];
  prevention_tips: string[];
  urgency: string;
  health_score: number;
}

function getScoreStatus(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Good", color: "#4CAF50" };
  if (score >= 60) return { label: "Fair", color: "#C9A227" };
  if (score >= 40) return { label: "Poor", color: "#FF8C00" };
  return { label: "Critical", color: "#E53935" };
}

const SEVERITY_TO_SAFETY: Record<string, "Safe" | "Caution" | "Toxic"> = {
  Mild: "Safe",
  Moderate: "Caution",
  Severe: "Toxic",
};

export default function PlantHealthScreen() {
  const insets = useSafeAreaInsets();
  const [screenState, setScreenState] = useState<ScreenState>("idle");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [step, setStep] = useState<AnalyseStep | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const saveToCache = async (uri: string): Promise<string> => {
    if (Platform.OS === "web") return uri;
    try {
      const filename = `health_${Date.now()}.jpg`;
      const dest = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.copyAsync({ from: uri, to: dest });
      return dest;
    } catch {
      return uri;
    }
  };

  const openCamera = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access to photograph your plant.",
        [{ text: "OK" }]
      );
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.7,
        exif: false,
      });
      if (!result.canceled && result.assets?.length > 0) {
        const uri = await saveToCache(result.assets[0].uri);
        setCapturedUri(uri);
        setScreenState("preview");
      }
    } catch {
      Alert.alert("Camera Error", "Could not open the camera. Try Gallery instead.");
    }
  };

  const pickFromGallery = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
        [{ text: "OK" }]
      );
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.7,
        exif: false,
      });
      if (!result.canceled && result.assets?.length > 0) {
        const uri = await saveToCache(result.assets[0].uri);
        setCapturedUri(uri);
        setScreenState("preview");
      }
    } catch {
      Alert.alert("Gallery Error", "Could not open the gallery.");
    }
  };

  const retake = () => {
    setCapturedUri(null);
    setStep(null);
    setHealthData(null);
    setScreenState("idle");
  };

  const analyseHealth = async () => {
    if (!capturedUri) return;
    setScreenState("analysing");
    try {
      setStep("reading");
      let base64: string | null = null;

      if (Platform.OS !== "web") {
        base64 = await FileSystem.readAsStringAsync(capturedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        const fetchRes = await fetch(capturedUri);
        const blob = await fetchRes.blob();
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      setStep("analysing");

      const apiResponse = await fetch(`${API_BASE}/api/plant-health`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64 }),
      });

      if (!apiResponse.ok) throw new Error("API failed");

      setStep("processing");
      const data: HealthData = await apiResponse.json();

      setHealthData(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScreenState("results");
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const isOffline =
        err?.message?.includes("fetch") ||
        err?.message?.includes("network") ||
        err?.message?.includes("Network");
      Alert.alert(
        isOffline ? "No Internet" : "Analysis Failed",
        isOffline
          ? "You're offline. An internet connection is needed for plant health analysis."
          : "Could not analyse this image. Please try a clearer photo of the affected area.",
        [{ text: "OK", onPress: () => setScreenState("preview") }]
      );
    } finally {
      setStep(null);
    }
  };

  const buildHealthReportText = (data: HealthData): string => {
    const score = typeof data.health_score === "number" ? data.health_score : 0;
    const scoreStatus = getScoreStatus(score);
    const lines: string[] = [
      "RUZIVO PLANT HEALTH REPORT",
      "==========================",
      "",
      `Plant: ${data.plant_name}`,
      `Condition: ${data.condition_name}`,
      `Severity: ${data.severity}`,
      `Urgency: ${data.urgency}`,
      "",
      "PLANT HEALTH SCORE",
      "------------------",
      `${score} / 100`,
      `Status: ${scoreStatus.label}`,
      "",
      "DESCRIPTION",
      "-----------",
      data.description,
      "",
      "SYMPTOMS OBSERVED",
      "-----------------",
    ];
    data.symptoms.forEach((s) => lines.push(`• ${s}`));
    lines.push("", "NATURAL TREATMENTS", "------------------");
    data.natural_treatments.forEach((t) => lines.push(`• ${t}`));
    lines.push("", "PREVENTION TIPS", "---------------");
    data.prevention_tips.forEach((p) => lines.push(`• ${p}`));
    lines.push(
      "",
      "---",
      "Generated by RUZIVO Plant Knowledge App",
      "For educational purposes only."
    );
    return lines.join("\n");
  };

  const handleCopyReport = async () => {
    if (!healthData) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const text = buildHealthReportText(healthData);
      await copyReportToClipboard(text);
      if (Platform.OS === "android") {
        ToastAndroid.show("Report copied!", ToastAndroid.SHORT);
      } else {
        Alert.alert("Copied!", "The health report has been copied to your clipboard.");
      }
    } catch {
      Alert.alert("Error", "Could not copy report.");
    }
  };

  const handleShare = async () => {
    if (!healthData) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const text = buildHealthReportText(healthData);
      await shareReport(text, healthData.condition_name);
    } catch {}
  };

  const isAnalysing = screenState === "analysing";

  if (screenState === "results" && healthData) {
    const safetyStatus = SEVERITY_TO_SAFETY[healthData.severity] ?? "Caution";

    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.header}>
          <Pressable
            onPress={retake}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <Feather name="arrow-left" size={22} color={Colors.primary.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Health Report</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 24 }]}
        >
          {capturedUri ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: capturedUri }}
                style={styles.plantImage}
                resizeMode="cover"
              />
              <View style={styles.imageBadge}>
                <Feather name="activity" size={12} color={Colors.primary.gold} />
                <Text style={styles.imageBadgeText}>Analysed</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.conditionCard}>
            <View style={styles.conditionTop}>
              <View style={styles.conditionNames}>
                <Text style={styles.conditionName}>{healthData.condition_name}</Text>
                <Text style={styles.plantNameText}>{healthData.plant_name}</Text>
              </View>
              {healthData.problem_identified ? (
                <SafetyBadge status={safetyStatus} size="large" />
              ) : (
                <View style={styles.healthyBadge}>
                  <Text style={styles.healthyBadgeText}>Healthy</Text>
                </View>
              )}
            </View>

            <Text style={styles.conditionDesc}>{healthData.description}</Text>

            <View style={styles.urgencyRow}>
              <Feather name="clock" size={14} color={Colors.primary.caution} />
              <Text style={styles.urgencyText}>{healthData.urgency}</Text>
            </View>
          </View>

          <PlantHealthScoreCard score={typeof healthData.health_score === "number" ? healthData.health_score : 0} />

          {healthData.problem_identified ? (
            <>
              <HealthSection
                icon="eye"
                title="Symptoms Observed"
                color={Colors.primary.caution}
                items={healthData.symptoms}
              />
              <HealthSection
                icon="sun"
                title="Natural Treatments"
                color={Colors.primary.safe}
                items={healthData.natural_treatments}
              />
              <HealthSection
                icon="shield"
                title="Prevention Tips"
                color={Colors.primary.gold}
                items={healthData.prevention_tips}
              />
            </>
          ) : (
            <View style={[styles.card, { alignItems: "center", gap: 12 }]}>
              <View style={[styles.cardIconBg, { backgroundColor: Colors.primary.safe + "22", width: 52, height: 52, borderRadius: 16 }]}>
                <Feather name="check-circle" size={28} color={Colors.primary.safe} />
              </View>
              <Text style={[styles.conditionName, { textAlign: "center" }]}>
                No Problems Detected
              </Text>
              <Text style={[styles.conditionDesc, { textAlign: "center" }]}>
                Your plant appears healthy in this image. Continue your current care practices.
              </Text>
            </View>
          )}

          <View style={styles.exportRow}>
            <Pressable
              onPress={handleCopyReport}
              style={({ pressed }) => [styles.exportBtn, pressed && styles.btnPressed]}
            >
              <Feather name="copy" size={16} color={Colors.primary.gold} />
              <Text style={styles.exportBtnText}>Copy Report</Text>
            </Pressable>

            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.exportBtn, pressed && styles.btnPressed]}
            >
              <Feather name="share-2" size={16} color={Colors.primary.gold} />
              <Text style={styles.exportBtnText}>Share</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={retake}
            style={({ pressed }) => [styles.checkAnotherBtn, pressed && styles.btnPressed]}
          >
            <Feather name="camera" size={18} color={Colors.primary.gold} />
            <Text style={styles.checkAnotherText}>Check Another Plant</Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            For educational purposes only. Consult an agricultural expert for severe plant diseases.
          </Text>
        </ScrollView>
      </View>
    );
  }

  if (screenState === "preview" || screenState === "analysing") {
    return (
      <View
        style={[styles.container, { paddingTop: topPad, paddingBottom: botPad }]}
      >
        <View style={styles.header}>
          <Pressable
            onPress={retake}
            disabled={isAnalysing}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <Feather name="arrow-left" size={22} color={Colors.primary.white} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {isAnalysing ? "Analysing..." : "Preview"}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.previewWrapper}>
          {capturedUri ? (
            <Image
              source={{ uri: capturedUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : null}

          {isAnalysing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator color={Colors.primary.gold} size="large" />
              <Text style={styles.analyzingText}>
                {step ? STEP_LABELS[step] : "Preparing..."}
              </Text>
            </View>
          )}
        </View>

        {isAnalysing && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    step === "reading"
                      ? "30%"
                      : step === "analysing"
                        ? "70%"
                        : "95%",
                },
              ]}
            />
          </View>
        )}

        {!isAnalysing && (
          <View style={styles.previewActions}>
            <View style={styles.hintCard}>
              <Feather name="activity" size={16} color={Colors.primary.gold} />
              <Text style={styles.hintText}>
                Photo captured — tap Analyse to check for health problems.
              </Text>
            </View>

            <Pressable
              onPress={analyseHealth}
              style={({ pressed }) => [styles.analyseBtn, pressed && styles.btnPressed]}
            >
              <Feather name="activity" size={20} color={Colors.primary.black} />
              <Text style={styles.analyseBtnText}>Analyse Plant Health</Text>
            </Pressable>

            <Pressable
              onPress={retake}
              style={({ pressed }) => [styles.retakeBtn, pressed && styles.btnPressed]}
            >
              <Feather name="camera" size={18} color={Colors.primary.gold} />
              <Text style={styles.retakeBtnText}>Retake Photo</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.disclaimer}>For educational purposes only.</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { paddingTop: topPad, paddingBottom: botPad }]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primary.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Plant Health</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.viewfinderBox}>
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />

          <View style={styles.viewfinderCenter}>
            <View style={styles.viewfinderIconBg}>
              <Feather name="activity" size={52} color={Colors.primary.gold + "80"} />
            </View>
            <Text style={styles.viewfinderTitle}>Plant Health Check</Text>
            <Text style={styles.viewfinderHint}>
              Photograph affected leaves, stems or visible symptoms to identify
              diseases and get natural treatment advice
            </Text>
          </View>
        </View>

        <View style={styles.infoNote}>
          <Feather name="info" size={13} color={Colors.primary.gold} />
          <Text style={styles.infoNoteText}>
            Works best with clear, close-up photos of affected plant areas in good lighting
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={pickFromGallery}
            style={({ pressed }) => [styles.sideBtn, pressed && styles.btnPressed]}
          >
            <Feather name="image" size={22} color={Colors.primary.gold} />
            <Text style={styles.sideBtnText}>Gallery</Text>
          </Pressable>

          <Pressable
            onPress={openCamera}
            style={({ pressed }) => [styles.captureBtn, pressed && styles.btnPressed]}
          >
            <View style={styles.captureBtnOuter}>
              <View style={styles.captureBtnInner} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push("/scan")}
            style={({ pressed }) => [styles.sideBtn, pressed && styles.btnPressed]}
          >
            <Feather name="camera" size={22} color={Colors.primary.gold} />
            <Text style={styles.sideBtnText}>ID Plant</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.disclaimer}>For educational purposes only.</Text>
    </View>
  );
}

function Corner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const isTop = position.startsWith("t");
  const isLeft = position.endsWith("l");
  return (
    <View
      style={[
        styles.corner,
        isTop ? { top: 20 } : { bottom: 20 },
        isLeft
          ? { left: 20, borderLeftWidth: 3, borderTopWidth: 3, borderTopLeftRadius: 8 }
          : { right: 20, borderRightWidth: 3, borderTopWidth: 3, borderTopRightRadius: 8 },
      ]}
    />
  );
}

function PlantHealthScoreCard({ score }: { score: number }) {
  const { label, color } = getScoreStatus(score);
  return (
    <View style={styles.scoreCard}>
      <View style={styles.scoreCardHeader}>
        <View style={[styles.scoreCardIconBg, { backgroundColor: color + "22" }]}>
          <Feather name="bar-chart-2" size={16} color={color} />
        </View>
        <Text style={styles.scoreCardTitle}>PLANT HEALTH SCORE</Text>
      </View>
      <View style={styles.scoreRow}>
        <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
        <Text style={styles.scoreDenominator}> / 100</Text>
      </View>
      <View style={[styles.scoreStatusBadge, { backgroundColor: color + "22", borderColor: color + "55" }]}>
        <View style={[styles.scoreStatusDot, { backgroundColor: color }]} />
        <Text style={[styles.scoreStatusText, { color }]}>Status: {label}</Text>
      </View>
      <View style={styles.scoreTrackBg}>
        <View style={[styles.scoreTrackFill, { width: `${score}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function HealthSection({
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
      <Text selectable style={styles.cardListText}>
        {combined}
      </Text>
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
  body: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 20,
  },
  viewfinderBox: {
    width: "100%",
    aspectRatio: 1,
    maxHeight: 300,
    borderRadius: 20,
    backgroundColor: Colors.primary.black + "40",
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: Colors.primary.gold,
  },
  viewfinderCenter: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  viewfinderIconBg: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: Colors.primary.gold + "12",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary.gold + "25",
  },
  viewfinderTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
    textAlign: "center",
  },
  viewfinderHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary.gold + "15",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary.gold + "30",
  },
  infoNoteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  captureBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  captureBtnOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: Colors.primary.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.gold,
  },
  sideBtn: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: Colors.primary.cardBg,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  sideBtnText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.textMuted,
  },
  previewWrapper: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.primary.cardBg,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary.black + "70",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  analyzingText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.white,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.primary.separator,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary.gold,
    borderRadius: 2,
  },
  previewActions: {
    paddingHorizontal: 20,
    gap: 12,
  },
  hintCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.primary.gold + "15",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary.gold + "30",
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    lineHeight: 18,
  },
  analyseBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.primary.gold,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  analyseBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.black,
  },
  retakeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary.gold + "60",
    paddingVertical: 14,
  },
  retakeBtnText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    height: 220,
  },
  plantImage: {
    width: "100%",
    height: "100%",
  },
  imageBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.primary.black + "99",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
  },
  conditionCard: {
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    gap: 12,
  },
  conditionTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  conditionNames: {
    flex: 1,
    gap: 4,
  },
  conditionName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.white,
    lineHeight: 26,
  },
  plantNameText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    fontStyle: "italic",
  },
  conditionDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    lineHeight: 20,
  },
  urgencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary.caution + "15",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary.caution + "30",
  },
  urgencyText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.caution,
    flex: 1,
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
  },
  cardIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
  },
  cardListText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    lineHeight: 24,
  },
  exportRow: {
    flexDirection: "row",
    gap: 10,
  },
  exportBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary.gold + "50",
    backgroundColor: Colors.primary.gold + "10",
    paddingVertical: 13,
  },
  exportBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
  },
  healthyBadge: {
    backgroundColor: Colors.primary.safe + "22",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.primary.safe + "55",
  },
  healthyBadgeText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.safe,
  },
  checkAnotherBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary.separator,
    paddingVertical: 14,
  },
  checkAnotherText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  disclaimer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted + "88",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
    lineHeight: 16,
  },
  scoreCard: {
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    gap: 12,
  },
  scoreCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  scoreCardIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreCardTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreNumber: {
    fontSize: 44,
    fontFamily: "Inter_700Bold",
    lineHeight: 48,
  },
  scoreDenominator: {
    fontSize: 20,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
  },
  scoreStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  scoreStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  scoreStatusText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  scoreTrackBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary.separator,
    overflow: "hidden",
  },
  scoreTrackFill: {
    height: 6,
    borderRadius: 3,
  },
});

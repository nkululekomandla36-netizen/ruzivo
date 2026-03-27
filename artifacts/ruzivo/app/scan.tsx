import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Colors from "@/constants/colors";
import { saveScan } from "@/lib/database";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

type ScanStep = "idle" | "reading" | "identifying" | "saving";

const STEP_LABELS: Record<ScanStep, string> = {
  idle: "",
  reading: "Reading image...",
  identifying: "Identifying plant with AI...",
  saving: "Saving results...",
};

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<ScanStep>("idle");

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const isAnalyzing = step !== "idle";

  const analyzeImage = async (uri: string) => {
    try {
      setStep("reading");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      let base64: string | null = null;

      if (Platform.OS !== "web") {
        base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        const response = await fetch(uri);
        const blob = await response.blob();
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      setStep("identifying");

      const apiResponse = await fetch(`${API_BASE}/api/plant-identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64 }),
      });

      if (!apiResponse.ok) {
        throw new Error("API request failed");
      }

      const plantData = await apiResponse.json();

      setStep("saving");

      const scanId =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);

      await saveScan({
        id: scanId,
        image_uri: uri,
        identified_name: plantData.identified ? plantData.name_common : null,
        confidence_score: plantData.confidence ?? null,
        timestamp: new Date().toISOString(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      router.push({
        pathname: "/result",
        params: {
          scanId,
          imageUri: encodeURIComponent(uri),
          plantData: encodeURIComponent(JSON.stringify(plantData)),
        },
      });
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const isOffline =
        err?.message?.includes("fetch") ||
        err?.message?.includes("network") ||
        err?.message?.includes("failed");
      Alert.alert(
        isOffline ? "No Internet Connection" : "Identification Failed",
        isOffline
          ? "No internet connection. Browse the Plant Library to find plants."
          : "Could not identify the plant. Please try again with a clearer photo.",
        [{ text: "OK" }]
      );
    } finally {
      setStep("idle");
    }
  };

  const pickFromGallery = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      analyzeImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow camera access to scan plants.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      analyzeImage(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: botPad }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primary.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Scan Plant</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.viewfinderWrapper}>
          <View style={styles.viewfinder}>
            <Corner position="tl" />
            <Corner position="tr" />
            <Corner position="bl" />
            <Corner position="br" />

            {isAnalyzing ? (
              <View style={styles.analyzingOverlay}>
                <ActivityIndicator color={Colors.primary.gold} size="large" />
                <Text style={styles.analyzingOverlayText}>{STEP_LABELS[step]}</Text>
              </View>
            ) : (
              <View style={styles.viewfinderCenter}>
                <Feather name="camera" size={48} color={Colors.primary.gold + "60"} />
                <Text style={styles.viewfinderHint}>Point at a plant to identify it</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.aiNote}>
          <Feather name="zap" size={14} color={Colors.primary.gold} />
          <Text style={styles.aiNoteText}>
            AI-powered identification — works with any plant worldwide
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={pickFromGallery}
            disabled={isAnalyzing}
            style={({ pressed }) => [
              styles.galleryBtn,
              pressed && styles.btnPressed,
              isAnalyzing && styles.btnDisabled,
            ]}
          >
            <Feather name="image" size={22} color={Colors.primary.gold} />
            <Text style={styles.galleryBtnText}>Gallery</Text>
          </Pressable>

          <Pressable
            onPress={takePhoto}
            disabled={isAnalyzing}
            style={({ pressed }) => [
              styles.captureBtn,
              pressed && styles.btnPressed,
              isAnalyzing && styles.btnDisabled,
            ]}
          >
            <View style={styles.captureBtnInner}>
              {isAnalyzing ? (
                <ActivityIndicator color={Colors.primary.black} size="small" />
              ) : (
                <Feather name="camera" size={28} color={Colors.primary.black} />
              )}
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push("/library")}
            disabled={isAnalyzing}
            style={({ pressed }) => [
              styles.galleryBtn,
              pressed && styles.btnPressed,
              isAnalyzing && styles.btnDisabled,
            ]}
          >
            <Feather name="book-open" size={22} color={Colors.primary.gold} />
            <Text style={styles.galleryBtnText}>Library</Text>
          </Pressable>
        </View>

        {isAnalyzing && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    step === "reading"
                      ? "30%"
                      : step === "identifying"
                        ? "70%"
                        : "95%",
                },
              ]}
            />
          </View>
        )}
      </View>

      <Text style={styles.disclaimer}>
        This information is for educational purposes only.
      </Text>
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
        isTop ? styles.cornerTop : styles.cornerBottom,
        isLeft ? styles.cornerLeft : styles.cornerRight,
      ]}
    />
  );
}

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  viewfinderWrapper: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 340,
    maxHeight: 340,
  },
  viewfinder: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Colors.primary.black + "40",
    borderWidth: 1,
    borderColor: Colors.primary.separator,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  viewfinderCenter: {
    alignItems: "center",
    gap: 12,
  },
  viewfinderHint: {
    color: Colors.primary.textMuted,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  analyzingOverlay: {
    alignItems: "center",
    gap: 16,
    padding: 24,
  },
  analyzingOverlayText: {
    color: Colors.primary.gold,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.primary.gold,
  },
  cornerTop: { top: 16 },
  cornerBottom: { bottom: 16 },
  cornerLeft: {
    left: 16,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 6,
  },
  cornerRight: {
    right: 16,
    borderRightWidth: CORNER_THICKNESS,
    borderTopWidth: CORNER_THICKNESS,
    borderTopRightRadius: 6,
  },
  aiNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.primary.gold + "15",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary.gold + "30",
    width: "100%",
  },
  aiNoteText: {
    flex: 1,
    color: Colors.primary.textMuted,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    width: "100%",
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: Colors.primary.gold,
  },
  captureBtnInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryBtn: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.primary.cardBg,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary.separator,
  },
  galleryBtnText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  btnDisabled: {
    opacity: 0.4,
  },
  progressBar: {
    width: "100%",
    height: 3,
    backgroundColor: Colors.primary.separator,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary.gold,
    borderRadius: 2,
  },
  disclaimer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted + "88",
    textAlign: "center",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
});

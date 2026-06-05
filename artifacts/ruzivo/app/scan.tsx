import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Colors from "@/constants/colors";
import { saveScan } from "@/lib/database";
import {
  getBushMode,
  cacheLastPlant,
  getLastCachedPlant,
} from "@/lib/offlineService";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

type ScreenState = "idle" | "preview" | "identifying";
type ScanStep = "reading" | "identifying" | "saving";

const STEP_LABELS: Record<ScanStep, string> = {
  reading: "Reading image...",
  identifying: "Identifying plant...",
  saving: "Saving results...",
};

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const [cameraPermission, setCameraPermission] =
    useState<ImagePicker.PermissionStatus | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>("idle");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [step, setStep] = useState<ScanStep | null>(null);
  const [bushMode, setBushMode] = useState(false);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  useEffect(() => {
    ImagePicker.requestCameraPermissionsAsync().then((result) => {
      setCameraPermission(result.status);
    });
    getBushMode().then(setBushMode);
  }, []);

  const saveToLocalFile = async (uri: string): Promise<string> => {
    if (Platform.OS === "web") return uri;
    try {
      const filename = `plant_${Date.now()}.jpg`;
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
    setCameraPermission(status);

    if (status !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access in your device settings to scan plants.",
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

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const rawUri = result.assets[0].uri;
        const localUri = await saveToLocalFile(rawUri);
        setCapturedUri(localUri);
        setScreenState("preview");
      }
    } catch (err: any) {
      Alert.alert("Camera Error", "Could not open the camera. Try using Gallery instead.");
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

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const rawUri = result.assets[0].uri;
        const localUri = await saveToLocalFile(rawUri);
        setCapturedUri(localUri);
        setScreenState("preview");
      }
    } catch (err: any) {
      Alert.alert("Gallery Error", "Could not open the gallery.");
    }
  };

  const retake = () => {
    setCapturedUri(null);
    setStep(null);
    setScreenState("idle");
  };

  const identifyPlant = async () => {
    if (!capturedUri) return;
    setScreenState("identifying");

    try {
      setStep("identifying");

      // Bush Mode: skip API, use last cached plant result
      if (bushMode) {
        setStep("saving");
        const cached = await getLastCachedPlant();
        const plantData = cached ?? {
          identified: false,
          name_common: "Unknown",
          name_scientific: "",
          confidence: 0,
          safety_status: "Safe",
          description: "Bush Mode is ON. Connect to the internet and scan again for full identification.",
          uses: [],
          warnings: [],
          traditional_uses: [],
          local_names: {},
          source: "offline",
        };
        const scanId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        await saveScan({
          id: scanId,
          image_uri: capturedUri,
          identified_name: (plantData as any).identified ? (plantData as any).name_common : null,
          confidence_score: (plantData as any).confidence ?? null,
          timestamp: new Date().toISOString(),
          plant_data_json: JSON.stringify(plantData),
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push({
          pathname: "/result",
          params: {
            scanId,
            imageUri: encodeURIComponent(capturedUri),
            plantData: encodeURIComponent(JSON.stringify(plantData)),
          },
        });
        return;
      }

      // Online mode: use API (existing logic unchanged)
      let base64: string | null = null;
      setStep("reading");

      if (Platform.OS !== "web") {
        base64 = await FileSystem.readAsStringAsync(capturedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        const response = await fetch(capturedUri);
        const blob = await response.blob();
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const r = reader.result as string;
            resolve(r.split(",")[1]);
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

      if (!apiResponse.ok) throw new Error("API failed");

      const plantData = await apiResponse.json();

      // Cache the result for Bush Mode fallback
      await cacheLastPlant(plantData);

      setStep("saving");

      const scanId =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);

      await saveScan({
        id: scanId,
        image_uri: capturedUri,
        identified_name: plantData.identified ? plantData.name_common : null,
        confidence_score: plantData.confidence ?? null,
        timestamp: new Date().toISOString(),
        plant_data_json: JSON.stringify(plantData),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      router.push({
        pathname: "/result",
        params: {
          scanId,
          imageUri: encodeURIComponent(capturedUri),
          plantData: encodeURIComponent(JSON.stringify(plantData)),
        },
      });
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const isOffline =
        err?.message?.includes("fetch") ||
        err?.message?.includes("network") ||
        err?.message?.includes("Network");
      Alert.alert(
        isOffline ? "No Internet" : "Identification Failed",
        isOffline
          ? "You're offline. Browse the Plant Library to find plants without internet."
          : "Could not identify this plant. Try a clearer, well-lit photo.",
        [{ text: "OK", onPress: () => setScreenState("preview") }]
      );
    } finally {
      setStep(null);
    }
  };

  const isAnalyzing = screenState === "identifying";

  if (screenState === "preview" || screenState === "identifying") {
    return (
      <View style={[styles.container, { paddingTop: topPad, paddingBottom: botPad }]}>
        <View style={styles.header}>
          <Pressable
            onPress={retake}
            disabled={isAnalyzing}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <Feather name="arrow-left" size={22} color={Colors.primary.white} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {isAnalyzing ? "Identifying..." : "Preview"}
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

          {isAnalyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator color={Colors.primary.gold} size="large" />
              <Text style={styles.analyzingText}>
                {step ? STEP_LABELS[step] : "Preparing..."}
              </Text>
            </View>
          )}
        </View>

        {isAnalyzing && (
          <View style={styles.progressTrack}>
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

        {!isAnalyzing && (
          <View style={styles.previewActions}>
            <View style={styles.previewHintCard}>
              <Feather name="check-circle" size={16} color={Colors.primary.safe} />
              <Text style={styles.previewHintText}>
                Photo captured! Tap Identify Plant to analyse.
              </Text>
            </View>

            <Pressable
              onPress={identifyPlant}
              style={({ pressed }) => [styles.identifyBtn, pressed && styles.btnPressed]}
            >
              <Feather name="zap" size={20} color={Colors.primary.black} />
              <Text style={styles.identifyBtnText}>Identify Plant</Text>
            </Pressable>

            <Pressable
              onPress={retake}
              style={({ pressed }) => [styles.retakeBtn, pressed && styles.btnPressed]}
            >
              <Feather name="camera" size={18} color={Colors.primary.gold} />
              <Text style={styles.retakeBtnText}>Retake Photo</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/library")}
              style={({ pressed }) => [styles.libraryOfflineBtn, pressed && { opacity: 0.6 }]}
            >
              <Feather name="book-open" size={14} color={Colors.primary.textMuted} />
              <Text style={styles.libraryOfflineBtnText}>Browse Plant Library (Offline)</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.disclaimer}>For educational purposes only.</Text>
      </View>
    );
  }

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
        <View style={styles.viewfinderBox}>
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />

          <View style={styles.viewfinderCenter}>
            <View style={styles.viewfinderIconBg}>
              <Feather name="camera" size={52} color={Colors.primary.gold + "80"} />
            </View>
            <Text style={styles.viewfinderTitle}>Ready to Scan</Text>
            <Text style={styles.viewfinderHint}>
              Take a photo or choose from your gallery to identify any plant
            </Text>
          </View>
        </View>

        {cameraPermission === "denied" && (
          <View style={styles.permWarning}>
            <Feather name="alert-circle" size={14} color={Colors.primary.caution} />
            <Text style={styles.permWarningText}>
              Camera access denied — you can still use Gallery
            </Text>
          </View>
        )}

        <View style={styles.aiNote}>
          <Feather name="zap" size={13} color={Colors.primary.gold} />
          <Text style={styles.aiNoteText}>
Identifies any plant worldwide
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
            onPress={() => router.push("/library")}
            style={({ pressed }) => [styles.sideBtn, pressed && styles.btnPressed]}
          >
            <Feather name="book-open" size={22} color={Colors.primary.gold} />
            <Text style={styles.sideBtnText}>Library</Text>
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
    maxHeight: 320,
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
  permWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary.caution + "15",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary.caution + "30",
  },
  permWarningText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.caution,
  },
  aiNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary.gold + "15",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary.gold + "30",
  },
  aiNoteText: {
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
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  captureBtnOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
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
  sideBtnText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  disclaimer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted + "88",
    textAlign: "center",
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 4,
  },
  previewWrapper: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.primary.black,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  analyzingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary.black + "BB",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  analyzingText: {
    color: Colors.primary.gold,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  progressTrack: {
    height: 4,
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: Colors.primary.separator,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary.gold,
    borderRadius: 2,
  },
  previewActions: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },
  previewHintCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.primary.safe + "15",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary.safe + "30",
  },
  previewHintText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
    lineHeight: 18,
  },
  identifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.primary.gold,
    borderRadius: 14,
    paddingVertical: 18,
  },
  identifyBtnText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.black,
  },
  retakeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: Colors.primary.gold + "50",
    backgroundColor: Colors.primary.gold + "10",
  },
  retakeBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.gold,
  },
  libraryOfflineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
  },
  libraryOfflineBtnText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
  },
});

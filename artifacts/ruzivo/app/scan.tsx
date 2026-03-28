import React, { useRef, useState, useEffect } from "react";
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
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { CameraView, useCameraPermissions } from "expo-camera";
import Colors from "@/constants/colors";
import { saveScan } from "@/lib/database";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

type ScreenState = "camera" | "preview" | "identifying" | "done";
type ScanStep = "reading" | "identifying" | "saving";

const STEP_LABELS: Record<ScanStep, string> = {
  reading: "Reading image...",
  identifying: "Identifying plant with AI...",
  saving: "Saving results...",
};

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [screenState, setScreenState] = useState<ScreenState>("camera");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [step, setStep] = useState<ScanStep | null>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
      });
      if (photo?.uri) {
        setCapturedUri(photo.uri);
        setScreenState("preview");
      }
    } catch {
      Alert.alert("Error", "Failed to take photo. Please try again.");
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
      setCapturedUri(result.assets[0].uri);
      setScreenState("preview");
    }
  };

  const retake = () => {
    setCapturedUri(null);
    setStep(null);
    setScreenState("camera");
  };

  const identifyPlant = async () => {
    if (!capturedUri) return;
    setScreenState("identifying");

    try {
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

      setStep("saving");

      const scanId =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);

      await saveScan({
        id: scanId,
        image_uri: capturedUri,
        identified_name: plantData.identified ? plantData.name_common : null,
        confidence_score: plantData.confidence ?? null,
        timestamp: new Date().toISOString(),
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
          ? "You're offline. Browse the Plant Library to identify plants without internet."
          : "Could not identify this plant. Try a clearer, well-lit photo.",
        [{ text: "OK", onPress: () => setScreenState("preview") }]
      );
    } finally {
      setStep(null);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: topPad }]}>
        <ActivityIndicator color={Colors.primary.gold} size="large" />
        <Text style={styles.permText}>Checking camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
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

        <View style={styles.centered}>
          <View style={styles.permIcon}>
            <Feather name="camera-off" size={40} color={Colors.primary.gold} />
          </View>
          <Text style={styles.permTitle}>Camera Access Needed</Text>
          <Text style={styles.permSubtitle}>
            RUZIVO needs camera access to scan and identify plants.
          </Text>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => [styles.permBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.permBtnText}>Grant Camera Access</Text>
          </Pressable>
          <Pressable
            onPress={pickFromGallery}
            style={({ pressed }) => [styles.galleryFallbackBtn, pressed && { opacity: 0.7 }]}
          >
            <Feather name="image" size={16} color={Colors.primary.gold} />
            <Text style={styles.galleryFallbackText}>Choose from Gallery Instead</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (screenState === "camera") {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <Feather name="arrow-left" size={22} color={Colors.primary.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Scan Plant</Text>
          <Pressable
            onPress={() => setFacing(f => f === "back" ? "front" : "back")}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <Feather name="refresh-cw" size={18} color={Colors.primary.white} />
          </Pressable>
        </View>

        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          >
            <Corner position="tl" />
            <Corner position="tr" />
            <Corner position="bl" />
            <Corner position="br" />

            <View style={styles.cameraHint}>
              <Text style={styles.cameraHintText}>Frame the plant clearly</Text>
            </View>
          </CameraView>
        </View>

        <View style={[styles.controls, { paddingBottom: botPad + 16 }]}>
          <View style={styles.aiNote}>
            <Feather name="zap" size={13} color={Colors.primary.gold} />
            <Text style={styles.aiNoteText}>
              AI-powered — identifies any plant worldwide
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
              onPress={takePhoto}
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

  if (screenState === "preview" || screenState === "identifying") {
    const isAnalyzing = screenState === "identifying";

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

        <ScrollView
          contentContainerStyle={styles.previewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.previewImageContainer}>
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
            <>
              <View style={styles.previewHintCard}>
                <Feather name="check-circle" size={18} color={Colors.primary.safe} />
                <Text style={styles.previewHintText}>
                  Photo captured! Tap Identify to scan this plant with AI.
                </Text>
              </View>

              <Pressable
                onPress={identifyPlant}
                style={({ pressed }) => [
                  styles.identifyBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Feather name="zap" size={20} color={Colors.primary.black} />
                <Text style={styles.identifyBtnText}>Identify Plant</Text>
              </Pressable>

              <Pressable
                onPress={retake}
                style={({ pressed }) => [
                  styles.retakeBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Feather name="camera" size={18} color={Colors.primary.gold} />
                <Text style={styles.retakeBtnText}>Retake Photo</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/library")}
                style={({ pressed }) => [
                  styles.libraryOfflineBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Feather name="book-open" size={16} color={Colors.primary.textMuted} />
                <Text style={styles.libraryOfflineBtnText}>
                  Browse Plant Library (Offline)
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>

        <Text style={styles.disclaimer}>For educational purposes only.</Text>
      </View>
    );
  }

  return null;
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
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
  cameraContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.primary.gold + "40",
  },
  camera: {
    flex: 1,
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: Colors.primary.gold,
  },
  cameraHint: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cameraHintText: {
    color: Colors.primary.white + "CC",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    backgroundColor: Colors.primary.black + "60",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  controls: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
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
    color: Colors.primary.textMuted,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
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
  permIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary.cardBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary.gold + "40",
  },
  permTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.white,
    textAlign: "center",
  },
  permSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  permBtn: {
    backgroundColor: Colors.primary.gold,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  permBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.black,
  },
  permText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    marginTop: 12,
  },
  galleryFallbackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  galleryFallbackText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
  },
  previewContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 8,
  },
  previewImageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    height: 300,
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
    backgroundColor: Colors.primary.separator,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary.gold,
    borderRadius: 2,
  },
  previewHintCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.primary.safe + "15",
    borderRadius: 12,
    padding: 14,
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
    paddingVertical: 16,
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
    paddingVertical: 12,
  },
  libraryOfflineBtnText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
  },
});

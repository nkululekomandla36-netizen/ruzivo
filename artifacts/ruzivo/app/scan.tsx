import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { saveScan } from "@/lib/database";

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

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
      quality: 0.8,
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
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (uri: string) => {
    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      await new Promise((r) => setTimeout(r, 1500));

      const scanId =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const scan = {
        id: scanId,
        image_uri: uri,
        identified_name: null,
        confidence_score: null,
        timestamp: new Date().toISOString(),
      };

      await saveScan(scan);

      router.push({
        pathname: "/result",
        params: { scanId, imageUri: uri },
      });
    } catch (err) {
      Alert.alert("Error", "Failed to process image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: botPad }]}>
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

            <View style={styles.viewfinderCenter}>
              <Feather name="camera" size={48} color={Colors.primary.gold + "60"} />
              <Text style={styles.viewfinderHint}>
                Point at a plant to identify it
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Feather name="wifi-off" size={14} color={Colors.primary.gold} />
          <Text style={styles.infoText}>
            No internet? Plant identification requires a connection. Browse the library offline.
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={pickFromGallery}
            style={({ pressed }) => [
              styles.galleryBtn,
              pressed && styles.btnPressed,
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
              isAnalyzing && { opacity: 0.7 },
            ]}
          >
            <LinearGradient
              colors={[Colors.primary.gold, "#A8841E"]}
              style={styles.captureBtnGradient}
            >
              {isAnalyzing ? (
                <Feather name="loader" size={28} color={Colors.primary.black} />
              ) : (
                <Feather name="camera" size={28} color={Colors.primary.black} />
              )}
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push("/library")}
            style={({ pressed }) => [
              styles.galleryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Feather name="book-open" size={22} color={Colors.primary.gold} />
            <Text style={styles.galleryBtnText}>Library</Text>
          </Pressable>
        </View>

        {isAnalyzing && (
          <View style={styles.analyzingBar}>
            <Feather name="zap" size={14} color={Colors.primary.gold} />
            <Text style={styles.analyzingText}>Identifying plant...</Text>
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
    backgroundColor: Colors.primary.darkGreen + "20",
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
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.primary.gold + "15",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary.gold + "30",
    width: "100%",
  },
  infoText: {
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
    shadowColor: Colors.primary.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  captureBtnGradient: {
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
  analyzingBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary.gold + "20",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary.gold + "40",
  },
  analyzingText: {
    color: Colors.primary.gold,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
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

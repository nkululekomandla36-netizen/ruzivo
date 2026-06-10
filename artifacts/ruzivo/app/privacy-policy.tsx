import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const botPad = Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Feather name="arrow-left" size={22} color={Colors.primary.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 32 }]}
      >
        <Text style={styles.appName}>RUZIVO</Text>
        <Text style={styles.tagline}>African Plant Knowledge App</Text>
        <Text style={styles.lastUpdated}>Last updated: June 2026</Text>

        <Text style={styles.intro}>
          RUZIVO is designed with your privacy as a priority. We collect only what
          is necessary to provide plant identification and health analysis, and we
          store everything locally on your device.
        </Text>

        <Section title="What We Collect">
          <BulletItem>
            <Text style={styles.bulletBold}>Plant photos</Text>
            <Text style={styles.bulletText}> — captured or chosen by you, sent to our AI service for identification or health analysis only. Photos are not stored on our servers.</Text>
          </BulletItem>
          <BulletItem>
            <Text style={styles.bulletBold}>Scan history</Text>
            <Text style={styles.bulletText}> — your past plant scans and health checks are stored locally on your device only. We have no access to this data.</Text>
          </BulletItem>
        </Section>

        <Section title="What We Don't Collect">
          <BulletItem><Text style={styles.bulletText}>No personal information of any kind</Text></BulletItem>
          <BulletItem><Text style={styles.bulletText}>No name, email address or password</Text></BulletItem>
          <BulletItem><Text style={styles.bulletText}>No location or GPS data</Text></BulletItem>
          <BulletItem><Text style={styles.bulletText}>No user accounts or profiles</Text></BulletItem>
          <BulletItem><Text style={styles.bulletText}>No tracking, analytics or advertising identifiers</Text></BulletItem>
        </Section>

        <Section title="Third-Party Services">
          <Text style={styles.sectionBody}>
            RUZIVO uses the following AI services to process plant images. When you
            submit a photo for analysis, it is sent to these services and subject to
            their respective privacy policies:
          </Text>
          <BulletItem>
            <Text style={styles.bulletBold}>OpenAI GPT-4o</Text>
            <Text style={styles.bulletText}> — used for plant identification and health diagnosis. Images are processed transiently and are not retained by OpenAI for training.</Text>
          </BulletItem>
          <BulletItem>
            <Text style={styles.bulletBold}>Google Gemini</Text>
            <Text style={styles.bulletText}> — used to generate contextual plant knowledge and traditional African plant information.</Text>
          </BulletItem>
        </Section>

        <Section title="Your Rights">
          <BulletItem><Text style={styles.bulletText}>Delete your scan history at any time from within the app</Text></BulletItem>
          <BulletItem><Text style={styles.bulletText}>All locally stored data is removed when you uninstall the app</Text></BulletItem>
          <BulletItem><Text style={styles.bulletText}>We cannot access, view or recover data stored on your device</Text></BulletItem>
          <BulletItem><Text style={styles.bulletText}>You may stop using the app at any time — no account deletion is needed</Text></BulletItem>
        </Section>

        <Section title="Data Security">
          <Text style={styles.sectionBody}>
            All communication between the app and our services uses encrypted HTTPS
            connections. Plant photos are transmitted securely and are not cached or
            stored by RUZIVO's servers after processing is complete.
          </Text>
        </Section>

        <Section title="Children's Privacy">
          <Text style={styles.sectionBody}>
            RUZIVO does not knowingly collect any information from children under the
            age of 13. The app does not require account creation or personal
            information from any user.
          </Text>
        </Section>

        <Section title="Changes to This Policy">
          <Text style={styles.sectionBody}>
            If we update this privacy policy, the new version will be published in
            the app and at our public privacy URL. Continued use of the app after
            changes constitutes acceptance of the updated policy.
          </Text>
        </Section>

        <View style={styles.contactCard}>
          <Feather name="mail" size={16} color={Colors.primary.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.contactLabel}>Privacy Contact</Text>
            <Text style={styles.contactEmail}>privacy@ruzivo.app</Text>
          </View>
        </View>

        <Text style={styles.publicUrl}>
          Public policy: ruzivo-plant-knowledge.replit.app/privacy
        </Text>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletContent}>{children}</Text>
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
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 4,
  },
  appName: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.gold,
    textAlign: "center",
    marginTop: 8,
  },
  tagline: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
    textAlign: "center",
    marginTop: 4,
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted + "99",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  intro: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
    lineHeight: 22,
    marginBottom: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.gold,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  sectionContent: {
    gap: 8,
  },
  sectionBody: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  bulletDot: {
    fontSize: 14,
    color: Colors.primary.gold,
    lineHeight: 22,
    marginTop: 1,
  },
  bulletContent: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  bulletBold: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.white,
    fontSize: 14,
  },
  bulletText: {
    fontFamily: "Inter_400Regular",
    color: Colors.primary.white,
    fontSize: 14,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 32,
    backgroundColor: Colors.primary.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary.gold + "30",
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted,
  },
  contactEmail: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary.gold,
    marginTop: 2,
  },
  publicUrl: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.primary.textMuted + "88",
    textAlign: "center",
    marginTop: 16,
  },
});

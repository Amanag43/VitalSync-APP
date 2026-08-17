import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { theme } from "../../theme/theme";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { getProfile } from "../../services/apiService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/home");
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Input", "Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;
      const store = useAuthStore.getState();
      store.setAuth(null, { id: user.uid, uid: user.uid, email: user.email });

      try {
        const response = await getProfile(user.uid);
        if (response.profile) {
          store.updateUser(response.profile);
        }
      } catch (profileError) {
        console.log("[Profile Notice]:", profileError.message);
      }

      router.replace("/home");
    } catch (err) {
      Alert.alert("Authentication Failed", err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.innerContainer}
      >
        {/* Futuristic Ambient Glow Rings */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        {/* Brand Hero Header */}
        <View style={styles.brandHero}>
          <View style={styles.logoBadge}>
            <Ionicons name="pulse-sharp" size={32} color={theme.colors.rose} />
          </View>
          <Text style={styles.appName}>VitalSync</Text>
          <View style={styles.subtitlePill}>
            <View style={styles.livePulseDot} />
            <Text style={styles.tagline}>PATIENT TELEMETRY & SOS SYSTEM</Text>
          </View>
        </View>

        {/* Main Glassmorphism Form Card */}
        <View style={styles.glassCard}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSub}>Enter your credentials to access live health monitoring</Text>

          {/* Email Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color={theme.colors.muted} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                placeholder="example@vitalsync.io"
                placeholderTextColor={theme.colors.muted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.colors.muted} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter password"
                placeholderTextColor={theme.colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Action Button */}
          <TouchableOpacity
            disabled={loading}
            onPress={handleLogin}
            style={[styles.mainBtn, loading && { opacity: 0.7 }]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.mainBtnText}>Sign In to Dashboard</Text>

              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>SECURE CONNECT</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google SSO Button */}
          <TouchableOpacity
            onPress={() => Alert.alert("Google Login", "Google Single Sign-On Active")}
            style={styles.googleBtn}
          >
            <Ionicons name="logo-google" size={18} color={theme.colors.text} style={{ marginRight: 8 }} />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Switch to Signup */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            style={styles.signupLinkRow}
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkBold}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  glowTop: {
    position: "absolute",
    top: -100,
    left: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(37, 99, 235, 0.15)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -120,
    right: -70,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
  brandHero: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    ...theme.shadow.card,
  },
  appName: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 0.8,
  },
  subtitlePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.mint,
    marginRight: 6,
  },
  tagline: {
    fontSize: 9,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 1.2,
  },
  glassCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 24,
    ...theme.shadow.card,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.colors.text,
  },
  welcomeSub: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
    marginTop: 4,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  textInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  mainBtn: {
    backgroundColor: theme.colors.primary,
    height: 58,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    ...theme.shadow.card,
  },
  mainBtnText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  dividerText: {
    fontSize: 9,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 1,
    marginHorizontal: 10,
  },
  googleBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleBtnText: {
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 14,
  },
  signupLinkRow: {
    marginTop: 18,
    alignItems: "center",
  },
  linkText: {
    fontSize: 13,
    color: theme.colors.muted,
    fontWeight: "600",
  },
  linkBold: {
    color: theme.colors.primary,
    fontWeight: "900",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { updateProfile } from "../../services/apiService";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPass) {
      Alert.alert("Missing Required Fields", "Please complete all mandatory fields.");
      return;
    }

    if (password !== confirmPass) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;
      const store = useAuthStore.getState();

      const newUserData = {
        id: user.uid,
        uid: user.uid,
        email: user.email,
        fullName: fullName.trim(),
        phone: phone.trim(),
        gender,
      };

      store.setAuth(null, newUserData);

      // Save initial profile to MongoDB
      try {
        await updateProfile(user.uid, newUserData);
      } catch (backendError) {
        console.log("[Signup Profile Sync Notice]:", backendError.message);
      }

      Alert.alert("Account Created", "Your VitalSync account is active!", [
        { text: "Get Started", onPress: () => router.replace("/home") },
      ]);
    } catch (err) {
      Alert.alert("Registration Failed", err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar */}
          <View style={styles.topHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>

          </View>

          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Create Account</Text>
            <Text style={styles.heroSub}>Set up your personal VitalSync telemetry profile</Text>
          </View>

          {/* Form Card */}
          <View style={styles.glassCard}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>FULL NAME *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={18} color={theme.colors.muted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. John Doe"
                  placeholderTextColor={theme.colors.muted}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={18} color={theme.colors.muted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor={theme.colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
              <View style={styles.inputBox}>
                <Ionicons name="call-outline" size={18} color={theme.colors.muted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor={theme.colors.muted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Gender Selector Chips */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>GENDER</Text>
              <View style={styles.chipRow}>
                {["Male", "Female", "Other"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setGender(g)}
                    style={[
                      styles.chip,
                      gender === g && styles.activeChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        gender === g && styles.activeChipText,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PASSWORD *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={18} color={theme.colors.muted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Min 6 characters"
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

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CONFIRM PASSWORD *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.muted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Re-enter password"
                  placeholderTextColor={theme.colors.muted}
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  secureTextEntry={!showPass}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              disabled={loading}
              onPress={handleSignup}
              style={[styles.mainBtn, loading && { opacity: 0.7 }]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.mainBtnText}>Complete Registration</Text>

                </>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              style={styles.loginLinkRow}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  stepBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 1,
  },
  heroSection: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: theme.colors.text,
  },
  heroSub: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
    fontWeight: "600",
  },
  glassCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 22,
    ...theme.shadow.card,
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
    height: 54,
  },
  textInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  activeChip: {
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.muted,
  },
  activeChipText: {
    color: theme.colors.primary,
    fontWeight: "900",
  },
  mainBtn: {
    backgroundColor: theme.colors.primary,
    height: 56,
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
    fontSize: 15,
    letterSpacing: 0.5,
  },
  loginLinkRow: {
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


import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AppScreen from "../../components/AppScreen";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuthStore } from "../../store/authStore";
import { theme } from "../../theme/theme";
import * as ImagePicker from "expo-image-picker";
import { createProfile, updateProfile } from "../../services/apiService";
import { calculateAge } from "../../utils/dateUtils";

export default function EditProfile() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [showDate, setShowDate] = useState(false);
  const [name, setName] = useState(user?.fullName || user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dob, setDob] = useState(user?.dob ? new Date(user.dob) : null);
  const [gender, setGender] = useState(user?.gender || "Other");
  const genders = ["Male", "Female", "Other"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const [image, setImage] = useState(user?.photo || user?.avatar || null);
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || "O+");
  const [height, setHeight] = useState(user?.height?.toString() || "");
  const [weight, setWeight] = useState(user?.weight?.toString() || "");
  const [allergies, setAllergies] = useState(user?.allergies?.join(", ") || "");
  const [diseases, setDiseases] = useState(user?.diseases?.join(", ") || "");
  const [medications, setMedications] = useState(user?.medications?.join(", ") || "");
  const [saving, setSaving] = useState(false);

  const toList = (value) =>
    typeof value === "string"
      ? value.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Information", "Please enter your full name.");
      return;
    }

    const userId = user?.id ?? user?.uid ?? "user123";

    const profile = {
      ...user,
      id: userId,
      userId,
      fullName: name.trim(),
      email,
      phone: phone.trim(),
      gender: gender || "Other",
      dob: dob && !Number.isNaN(dob.getTime()) ? dob.toISOString().slice(0, 10) : undefined,
      photo: image || "",
      bloodGroup,
      height: Number(height) || 0,
      weight: Number(weight) || 0,
      allergies: toList(allergies),
      diseases: toList(diseases),
      medications: toList(medications),
    };

    try {
      setSaving(true);
      
      // Attempt backend sync, but do not block local state update if backend 404s
      let response = null;
      try {
        response = await updateProfile(userId, profile).catch(async () => {
          return await createProfile(profile);
        });
      } catch (networkErr) {
        console.log("[Profile Sync Notice] Backend returned error/404, saving locally:", networkErr.message);
      }

      const updatedProf = response?.profile || profile;
      updateUser(updatedProf);
      
      Alert.alert("Profile Updated", "Your health profile has been saved successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      // Fallback: save profile state locally
      updateUser(profile);
      Alert.alert("Profile Updated", "Your profile has been saved on this device.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setSaving(false);
    }
  };

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Camera roll access is required to update photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  }

  const currentAge = calculateAge(dob);

  return (
    <AppScreen>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Health Profile</Text>
        <View style={{ width: 45 }} />
      </View>

      {showDate && (
        <DateTimePicker
          value={dob ?? new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, date) => {
            setShowDate(false);
            if (date) {
              setDob(date);
            }
          }}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar Card Header */}
        <View style={styles.avatarCard}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={44} color={theme.colors.text} />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarName}>{name || "Patient Profile"}</Text>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhotoText}>Tap to change profile picture</Text>
          </TouchableOpacity>
        </View>

        {/* Section 1: Personal Records */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>

          <Input label="Full Name" value={name} onChangeText={setName} placeholder="e.g. Aman Agarwal" />

          <Input label="Email Address" value={email} editable={false} />

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="e.g. +1 555 019 2834"
          />

          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>
              Date of Birth {currentAge !== "--" ? `(Calculated Age: ${currentAge} yrs)` : ""}
            </Text>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDate(true)}
            >
              <Ionicons name="calendar-outline" size={18} color={theme.colors.muted} style={{ marginRight: 10 }} />
              <Text style={{ color: dob ? theme.colors.text : theme.colors.muted, fontSize: 15, fontWeight: "700" }}>
                {dob ? dob.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select Date of Birth"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Gender Chips */}
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.chipRow}>
              {genders.map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[styles.chip, gender === g && styles.chipActive]}
                >
                  <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Section 2: Medical & Vital Profile */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>MEDICAL & VITAL PROFILES</Text>

          {/* Blood Group Chips */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Blood Group</Text>
            <View style={styles.chipRow}>
              {bloodGroups.map((bg) => (
                <TouchableOpacity
                  key={bg}
                  onPress={() => setBloodGroup(bg)}
                  style={[styles.chip, bloodGroup === bg && styles.chipActive]}
                >
                  <Text style={[styles.chipText, bloodGroup === bg && styles.chipTextActive]}>{bg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Input
                label="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="175"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="70"
              />
            </View>
          </View>

          <Input
            label="Known Allergies"
            value={allergies}
            onChangeText={setAllergies}
            placeholder="e.g. Penicillin, Pollen"
          />

          <Input
            label="Medical Conditions"
            value={diseases}
            onChangeText={setDiseases}
            placeholder="e.g. Asthma, Hypertension"
          />

          <Input
            label="Current Medications"
            value={medications}
            onChangeText={setMedications}
            placeholder="e.g. Lisinopril 10mg"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? "Saving Changes..." : "Save Profile & Vitals"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppScreen>
  );
}

function Input({ label, ...props }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.muted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.text,
  },
  back: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
    ...theme.shadow.card,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarName: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.text,
  },
  changePhotoText: {
    marginTop: 4,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  sectionTitle: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 16,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    height: 54,
    color: theme.colors.text,
    fontSize: 15,
  },
  dateSelector: {
    backgroundColor: theme.colors.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.muted,
  },
  chipTextActive: {
    color: "white",
    fontWeight: "900",
  },
  button: {
    height: 58,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    marginTop: 10,
    marginBottom: 40,
    ...theme.shadow.card,
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 17,
  },
});


import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import {
  getEmergencyContacts,
  saveEmergencyContact,
  deleteEmergencyContact,
  sendSOSAlert,
} from "../../services/emergencyservice";
import AppScreen from "../../components/AppScreen";
import { theme } from "../../theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function EmergencyContactsScreen() {
  const userId = useAuthStore((s) => s.user?.id ?? s.user?.uid ?? s.user?.userId);
  const profile = useAuthStore((s) => s.user);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("Family");
  const [saving, setSaving] = useState(false);

  const relationshipOptions = ["Family", "Spouse", "Doctor", "Friend", "Other"];

  const loadContacts = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getEmergencyContacts(userId);
      setContacts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleAddContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Missing Information", "Please enter contact full name and phone number.");
      return;
    }

    setSaving(true);
    const success = await saveEmergencyContact(userId, {
      name: name.trim(),
      phone: phone.trim(),
      relation: relation || "Family",
    });

    if (success) {
      setName("");
      setPhone("");
      setRelation("Family");
      await loadContacts();
      Alert.alert("Contact Added", "New emergency contact registered successfully.");
    } else {
      Alert.alert("Error", "Failed to add emergency contact.");
    }
    setSaving(false);
  };

  const handleDeleteContact = async (contactId) => {
    setSaving(true);
    const success = await deleteEmergencyContact(userId, contactId);
    if (success) {
      await loadContacts();
    } else {
      Alert.alert("Error", "Failed to delete contact.");
    }
    setSaving(false);
  };

  const handleTestSOS = async () => {
    if (contacts.length === 0) {
      Alert.alert("No Contacts", "Add at least one emergency contact first.");
      return;
    }

    setSaving(true);
    const result = await sendSOSAlert(userId, null, {
      vital: "Test Alert - Verified Safe",
      severity: "warning",
    }, profile);

    if (result.sent > 0) {
      Alert.alert("SOS Verified", `Test dispatch notification sent to ${result.sent} emergency contact(s).`);
    } else {
      Alert.alert("Dispatch Result", result.reason ?? "Unable to dispatch test SOS.");
    }
    setSaving(false);
  };

  return (
    <AppScreen>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Banner Info */}
        <View style={styles.infoBanner}>
          <Ionicons name="shield-checkmark" size={22} color={theme.colors.mint} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.infoBannerTitle}>Automated SOS Alert Network</Text>
            <Text style={styles.infoBannerSub}>
              During abnormal vitals or crash events, automated SMS & GPS alerts are dispatched instantly to all listed contacts.
            </Text>
          </View>
        </View>

        {/* Add Contact Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add Trusted Contact</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dr. Sarah Jenkins"
              placeholderTextColor={theme.colors.muted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. +1 (555) 019-2834"
              placeholderTextColor={theme.colors.muted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Relationship Selection Chips */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Relationship</Text>
            <View style={styles.chipRow}>
              {relationshipOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setRelation(opt)}
                  style={[
                    styles.chip,
                    relation === opt && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      relation === opt && styles.chipTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddContact}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="person-add" size={18} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.addButtonText}>Save Emergency Contact</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Trusted Contacts List Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Registered Contacts ({contacts.length})</Text>

          {loading ? (
            <ActivityIndicator color={theme.colors.primary} size="large" style={{ marginVertical: 20 }} />
          ) : contacts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={theme.colors.muted} />
              <Text style={styles.emptyText}>No emergency contacts added yet.</Text>
            </View>
          ) : (
            contacts.map((contact, index) => (
              <View
                key={contact._id || index}
                style={[
                  styles.contactRow,
                  index === contacts.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.contactInfo}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitials}>
                      {contact.name ? contact.name.charAt(0).toUpperCase() : "C"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.relationBadge}>
                        <Text style={styles.relationBadgeText}>{contact.relation || "Family"}</Text>
                      </View>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                  </View>
                </View>

                {/* Quick Call & Delete Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => Linking.openURL(`tel:${contact.phone}`)}
                  >
                    <Ionicons name="call" size={16} color={theme.colors.mint} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      Alert.alert(
                        "Delete Contact",
                        `Remove ${contact.name} from emergency contacts?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => handleDeleteContact(contact._id),
                          },
                        ]
                      )
                    }
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Test SOS Button */}
        <View style={[styles.card, { borderColor: "rgba(239, 68, 68, 0.3)" }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.rose }]}>SOS DISPATCH TEST</Text>
          <Text style={styles.note}>
            Verify live communication with your emergency contacts by dispatching a safe test notification.
          </Text>

          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestSOS}
            disabled={saving || contacts.length === 0}
          >
            <Ionicons name="paper-plane" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.addButtonText}>Dispatch Test SOS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppScreen>
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
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    marginBottom: 20,
  },
  infoBannerTitle: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 14,
    marginBottom: 2,
  },
  infoBannerSub: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 17,
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
    marginBottom: 18,
  },
  inputContainer: {
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
  addButton: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.cardLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  contactInitials: {
    color: theme.colors.primary,
    fontWeight: "900",
    fontSize: 18,
  },
  contactName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  relationBadge: {
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  relationBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#3B82F6",
  },
  contactPhone: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  callButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyText: {
    color: theme.colors.muted,
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  testButton: {
    backgroundColor: theme.colors.rose,
    height: 54,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  note: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
});


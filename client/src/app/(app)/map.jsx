import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Text,
  Linking,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import EmergencyOverlay from "../../components/EmergencyOverlay";
import { getNearbyHospitals } from "../../services/hospitalService";
import HospitalBottomSheet from "../../components/HospitalBottomSheet";
import { getRoute } from "../../services/routingService";
import { sendSOSAlert } from "../../services/emergencyservice";
import { useAuthStore } from "../../store/authStore";
import { useVitalsStore } from "../../store/vitalsStore";

export default function MapScreen() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? user?.uid ?? "user123";

  const mapRef = useRef(null);
  const locationSubscription = useRef(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [sendingSOS, setSendingSOS] = useState(false);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [followingUser, setFollowingUser] = useState(true);
  const followingUserRef = useRef(true);
  const selectedHospitalRef = useRef(null);
  const [hospitals, setHospitals] = useState([]);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const emergencyActive = useVitalsStore((s) => s.emergencyActive);
  const activeAlert = useVitalsStore((s) => s.activeAlert);
  const stopEmergency = useVitalsStore((s) => s.stopEmergency);

  function navigateToHospital() {
    if (!selectedHospital) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.latitude},${selectedHospital.longitude}&travelmode=driving`;
    Linking.openURL(url);
  }

  function callHospital() {
    Alert.alert(
      "Hospital Contact",
      selectedHospital?.phone ? `Call ${selectedHospital.phone}?` : "Direct phone number unavailable for this hospital."
    );
  }

  function findNearestHospital(userPos, hospitalList) {
    if (!hospitalList || !hospitalList.length) return null;

    let nearest = hospitalList[0];
    let shortest = Infinity;

    hospitalList.forEach((hospital) => {
      const d =
        Math.pow(userPos.latitude - hospital.latitude, 2) +
        Math.pow(userPos.longitude - hospital.longitude, 2);

      if (d < shortest) {
        shortest = d;
        nearest = hospital;
      }
    });

    return nearest;
  }

  async function initialize() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Location permission is required for emergency navigation.");
        setLoading(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(current.coords);
      const nearby = await getNearbyHospitals(
        current.coords.latitude,
        current.coords.longitude
      );

      setHospitals(nearby);
      const nearest = findNearestHospital(current.coords, nearby);

      setSelectedHospital(nearest);
      selectedHospitalRef.current = nearest;

      if (nearest) {
        const routeData = await getRoute(current.coords, nearest);
        setRoute(routeData);
      }

      mapRef.current?.animateToRegion(
        {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        async (loc) => {
          setLocation(loc.coords);

          if (selectedHospitalRef.current) {
            try {
              const updatedRoute = await getRoute(
                loc.coords,
                selectedHospitalRef.current
              );
              setRoute(updatedRoute);
            } catch (e) {
              console.error("Failed to update route:", e);
            }
          }

          if (followingUserRef.current) {
            mapRef.current?.animateCamera({
              center: {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              },
              zoom: 17,
            });
          }
        }
      );
    } catch (e) {
      console.log(e);
      Alert.alert("Location Notice", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function locateMe() {
    try {
      setFollowingUser(true);
      followingUserRef.current = true;
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(loc.coords);

      mapRef.current?.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );

      const nearby = await getNearbyHospitals(
        loc.coords.latitude,
        loc.coords.longitude
      );
      setHospitals(nearby);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  }

  useEffect(() => {
    initialize();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  async function handleEmergencyFinished() {
    if (sendingSOS) return;
    if (!isMountedRef.current) return;

    setSendingSOS(true);

    try {
      const result = await sendSOSAlert(userId, location, activeAlert, user);

      if (!isMountedRef.current) return;

      stopEmergency();
      Alert.alert("Emergency Alert Sent", `SOS notification sent to ${result.sent} emergency contact(s).`);
    } catch (e) {
      if (isMountedRef.current) {
        Alert.alert("SOS Failed", e.message);
      }
    } finally {
      if (isMountedRef.current) {
        setSendingSOS(false);
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff3b5c" />
        <Text style={styles.loadingText}>Locating nearest medical centers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        onPanDrag={() => {
          setFollowingUser(false);
          followingUserRef.current = false;
        }}
        style={StyleSheet.absoluteFill}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: location?.latitude || 28.6139,
          longitude: location?.longitude || 77.209,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            description="Active GPS Position"
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: "#2563EB",
                borderWidth: 3,
                borderColor: "white",
              }}
            />
          </Marker>
        )}
        {route && (
          <Polyline
            coordinates={route.coordinates}
            strokeWidth={6}
            strokeColor="#3B82F6"
          />
        )}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id || hospital.name}
            coordinate={{
              latitude: hospital.latitude,
              longitude: hospital.longitude,
            }}
            title={hospital.name}
            pinColor={selectedHospital?.id === hospital.id ? "green" : "red"}
            onPress={async () => {
              setSelectedHospital(hospital);
              selectedHospitalRef.current = hospital;
              try {
                const newRoute = await getRoute(location, hospital);
                setRoute(newRoute);
              } catch (e) {
                console.log("Route error:", e.message);
              }
            }}
          />
        ))}
      </MapView>

      {/* Top Destination Hospital Banner */}
      {selectedHospital && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>🏥 {selectedHospital.name}</Text>
          <Text style={styles.routeTextSub}>
            Emergency Care Center • {selectedHospital.distance ? `${selectedHospital.distance} km away` : "Nearby"}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.locateButton} onPress={locateMe}>
        <Text style={styles.locateText}>🎯</Text>
      </TouchableOpacity>

      <HospitalBottomSheet
        hospital={selectedHospital}
        route={route}
        onNavigate={navigateToHospital}
        onCall={callHospital}
      />

      <EmergencyOverlay
        visible={emergencyActive}
        alert={activeAlert}
        onCancel={stopEmergency}
        onFinished={() => {
          setTimeout(handleEmergencyFinished, 0);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  loadingText: {
    color: "white",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "700",
  },
  locateButton: {
    position: "absolute",
    right: 20,
    top: 130,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(17, 24, 39, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    elevation: 8,
  },
  locateText: {
    fontSize: 22,
  },
  routeInfo: {
    position: "absolute",
    top: 55,
    left: 16,
    right: 16,
    backgroundColor: "rgba(17, 24, 39, 0.95)",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    elevation: 6,
  },
  routeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  routeTextSub: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
});
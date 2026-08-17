export async function getNearbyHospitals(latitude, longitude) {
  try {
    const radius = 4000; // 8km radius

    // 1. Keep the query clean and tightly joined
    const query = `[out:json];(node["amenity"="hospital"](around:${radius},${latitude},${longitude});way["amenity"="hospital"](around:${radius},${latitude},${longitude});relation["amenity"="hospital"](around:${radius},${latitude},${longitude}););out center;`;

    const cleanQuery = query.replace(/\s+/g, " ").trim();
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(cleanQuery)}`;

    // 2. Fetch using strict Overpass security-compliant headers
    const res = await fetch(url, {
      method: "GET",
      headers: {
        // ✅ MUST NOT look like stock Postman/Mozilla. Make it distinct.
        "User-Agent": "MobileEmergencyLocatorApp/1.0.0 (HealthAppProject)",
        "Accept": "application/json",
        // ✅ CRITICAL FOR OVERPASS: A valid structure is required to pass their browser proxy filter
        "Referer": "http://localhost:8081",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch hospitals: ${res.status}`);
    }

    const json = await res.json();

    return (json.elements || []).map((item) => ({
      id: item.id,
      name: item.tags?.name || "Hospital",
      latitude: item.lat ?? item.center?.lat,
      longitude: item.lon ?? item.center?.lon,
    }));
  } catch (err) {
    console.error("Hospital Fetch Error:", err.message);
    return [];
  }
}
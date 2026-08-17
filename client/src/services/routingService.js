export async function getRoute(start, end) {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start.longitude},${start.latitude};` +
      `${end.longitude},${end.latitude}` +
      `?overview=full&geometries=geojson`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Unable to fetch route");
    }

    const json = await res.json();

    if (!json.routes?.length) {
      return null;
    }

    const route = json.routes[0];

    return {
      coordinates: route.geometry.coordinates.map(([lon, lat]) => ({
        latitude: lat,
        longitude: lon,
      })),
      distance: route.distance,
      duration: route.duration,
    };
  } catch (e) {
    console.log("Route Error:", e);

    return null;
  }
}
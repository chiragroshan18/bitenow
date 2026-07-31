/**
 * Fetches a driving route between two [lat, lng] points using OSRM's
 * free public routing API. No API key required.
 * https://project-osrm.org/docs/v5.5.1/api/#general-options
 */
export async function getRoute(start, end) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch route');

  const data = await res.json();
  if (!data.routes || data.routes.length === 0) {
    throw new Error('No route found between these points');
  }

  const route = data.routes[0];
  return {
    coordinates: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}
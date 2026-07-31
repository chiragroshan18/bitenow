import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import { getRoute } from '@/services/routingService';

/**
 * Fetches and draws a driving route between two points as a blue polyline.
 * Calls onRouteLoaded with { coordinates, distanceMeters, durationSeconds }
 * once loaded, so the parent can compute ETA.
 */
function RoutingMachine({ start, end, onRouteLoaded }) {
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    if (!start || !end) return;
    let cancelled = false;

    getRoute(start, end)
      .then((route) => {
        if (cancelled) return;
        setCoordinates(route.coordinates);
        onRouteLoaded?.(route);
      })
      .catch(() => {
        // Silently fail — the map still shows markers even without a route line.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start?.[0], start?.[1], end?.[0], end?.[1]]);

  if (coordinates.length === 0) return null;

  return (
    <Polyline
      positions={coordinates}
      pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.7 }}
    />
  );
}

export default RoutingMachine;
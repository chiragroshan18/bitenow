import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { socket } from '@/lib/socket';
import RoutingMachine from './RoutingMachine';
import { haversineDistanceKm } from '@/utils/geo';

const createEmojiIcon = (emoji) =>
  L.divIcon({
    html: `<div style="font-size:28px; line-height:1;">${emoji}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 28],
  });

const restaurantIcon = createEmojiIcon('🍽️');
const destinationIcon = createEmojiIcon('📍');
const riderIcon = createEmojiIcon('🛵');

/**
 * Shows the full delivery experience: restaurant + destination markers,
 * a blue OSRM route between them, a live-moving rider marker driven by
 * Socket.IO 'delivery:locationUpdated' events, and an ETA estimate that
 * recalculates as the rider moves.
 */
function LiveTrackingMap({ orderId, restaurantPosition, destinationPosition }) {
  const [riderPosition, setRiderPosition] = useState(restaurantPosition);
  const [routeInfo, setRouteInfo] = useState(null);
  const [eta, setEta] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    socket.connect();
    socket.emit('join-order-room', orderId);

    const handleLocationUpdate = (payload) => {
      if (payload.orderId === orderId) {
        setRiderPosition([payload.latitude, payload.longitude]);
      }
    };

    socket.on('delivery:locationUpdated', handleLocationUpdate);

    return () => {
      socket.emit('leave-order-room', orderId);
      socket.off('delivery:locationUpdated', handleLocationUpdate);
      socket.disconnect();
    };
  }, [orderId]);

  // Recompute ETA whenever the rider moves, using the average speed
  // derived from the initial OSRM route's distance/duration.
  useEffect(() => {
    if (!routeInfo || !riderPosition || !destinationPosition) return;

    const avgSpeedKmh =
      routeInfo.distanceMeters / 1000 / (routeInfo.durationSeconds / 3600);

    const remainingKm = haversineDistanceKm(
      riderPosition[0],
      riderPosition[1],
      destinationPosition[0],
      destinationPosition[1]
    );

    const remainingHours = avgSpeedKmh > 0 ? remainingKm / avgSpeedKmh : 0;
    setEta(Math.max(1, Math.round(remainingHours * 60)));
  }, [riderPosition, routeInfo, destinationPosition]);

  if (!restaurantPosition || !destinationPosition) {
    return (
      <div className="aspect-video w-full rounded-3xl bg-muted flex items-center justify-center text-muted-foreground">
        Location data not available for this order.
      </div>
    );
  }

  return (
    <div>
      {eta != null && (
        <div className="mb-2 p-3 rounded-md bg-secondary flex justify-between items-center">
          <span className="font-medium">Estimated arrival</span>
          <span className="font-semibold">{eta} min</span>
        </div>
      )}

      <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-xl shadow-black/20">
        <MapContainer
          bounds={[restaurantPosition, destinationPosition]}
          boundsOptions={{ padding: [50, 50] }}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RoutingMachine
            start={restaurantPosition}
            end={destinationPosition}
            onRouteLoaded={setRouteInfo}
          />

          <Marker position={restaurantPosition} icon={restaurantIcon}>
            <Popup>Restaurant</Popup>
          </Marker>
          <Marker position={destinationPosition} icon={destinationIcon}>
            <Popup>Delivery address</Popup>
          </Marker>
          {riderPosition && (
            <Marker position={riderPosition} icon={riderIcon}>
              <Popup>Delivery partner</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default LiveTrackingMap;
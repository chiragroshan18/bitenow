import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * Displays a single restaurant's location on a free OpenStreetMap tile layer.
 */
function RestaurantMap({ latitude, longitude, name, address }) {
  if (latitude == null || longitude == null) {
    return (
      <div className="aspect-video w-full rounded-3xl bg-muted flex items-center justify-center text-muted-foreground">
        Location not available for this restaurant.
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-xl shadow-black/20">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={defaultIcon}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default RestaurantMap;
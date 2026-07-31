import { useEffect, useRef, useState } from 'react';
import { socket } from '@/lib/socket';

/**
 * Used on the delivery partner's device/page. Reads the browser's real GPS
 * position via the Geolocation API and streams it into the order's room
 * every few seconds while `isActive` is true.
 */
export function useDeliveryLocationSharing(orderId, accessToken, isActive) {
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!isActive || !orderId || !accessToken) return;

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    socket.connect();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setError(null);
        socket.emit('delivery:sendLocation', {
          orderId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          token: accessToken,
        });
      },
      (err) => {
        // Desktop devices without GPS hardware rely on slower network-based
        // location and often time out — don't treat this as fatal, just note it.
        setError(
          'Waiting for a location fix (this can be slow on desktop without GPS)...'
        );
      },
      { enableHighAccuracy: false, maximumAge: 30000, timeout: 20000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      socket.disconnect();
    };
  }, [orderId, accessToken, isActive]);

  return { error };
}
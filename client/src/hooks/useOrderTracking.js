import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

/**
 * Joins the Socket.IO room for a specific order and returns the latest
 * status pushed by the server. Used by the order tracking page.
 */
export function useOrderTracking(orderId) {
  const [liveStatus, setLiveStatus] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    socket.connect();
    socket.emit('join-order-room', orderId);

    const handleStatusUpdate = (payload) => {
      if (payload.orderId === orderId) {
        setLiveStatus(payload);
      }
    };

    socket.on('order:statusUpdated', handleStatusUpdate);

    return () => {
      socket.emit('leave-order-room', orderId);
      socket.off('order:statusUpdated', handleStatusUpdate);
      socket.disconnect();
    };
  }, [orderId]);

  return liveStatus;
}
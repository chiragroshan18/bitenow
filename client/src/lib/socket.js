import { io } from 'socket.io-client';

/**
 * Single shared Socket.IO client instance.
 * autoConnect: false means we only connect when a component actually
 * needs live updates (e.g. the order tracking page), not on every page load.
 */
export const socket = io('http://localhost:5000', {
  autoConnect: false,
  withCredentials: true,
});
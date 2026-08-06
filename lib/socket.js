'use client';

import { io } from 'socket.io-client';
import { getToken } from './apiClient';

/**
 * Single shared Socket.io connection.
 *
 * The backend authenticates the handshake with the same JWT the REST API uses
 * and derives the user id from it — a client-supplied userId is rejected, so
 * the token must be present or the connection is refused.
 */
const SOCKET_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api').replace(
  /\/api\/?$/,
  ''
);

let socket = null;

export function getSocket() {
  if (typeof window === 'undefined') return null;

  const token = getToken();
  if (!token) return null;

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

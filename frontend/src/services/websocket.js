import { io } from 'socket.io-client';

// ✅ Use Vite convention
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],  // force websocket
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 🔑 Make sure this event matches your backend
  joinChat(userId) {
    if (this.socket) {
      this.socket.emit('join', { userId });  
    }
  }

  onConnect(callback) {
    if (this.socket) {
      this.socket.on('connect', callback);
    }
  }

  onDisconnect(callback) {
    if (this.socket) {
      this.socket.on('disconnect', callback);
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  onCrisisAlert(callback) {
    if (this.socket) {
      this.socket.on('crisis_alert', callback);
    }
  }

  sendMessage(data) {
    if (this.socket) {
      this.socket.emit('send_message', data);
    }
  }
}

export const websocketService = new WebSocketService();

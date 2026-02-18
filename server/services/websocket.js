const { v4: uuidv4 } = require('uuid');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
    this.rooms = new Map();
  }

  initialize(wss) {
    this.wss = wss;

    this.wss.on('connection', (ws, req) => {
      const clientId = uuidv4();
      this.clients.set(clientId, { ws, userId: null, rooms: new Set() });

      console.log(`Client connected: ${clientId}`);

      ws.on('message', (message) => {
        this.handleMessage(clientId, message);
      });

      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connected',
        clientId,
        timestamp: new Date().toISOString()
      });
    });
  }

  handleMessage(clientId, message) {
    try {
      const data = JSON.parse(message);
      const client = this.clients.get(clientId);

      switch (data.type) {
        case 'authenticate':
          this.handleAuthentication(clientId, data);
          break;
        case 'join_room':
          this.joinRoom(clientId, data.roomId);
          break;
        case 'leave_room':
          this.leaveRoom(clientId, data.roomId);
          break;
        case 'code_update':
          this.broadcastToRoom(data.roomId, {
            type: 'code_update',
            userId: client.userId,
            data: data.data,
            timestamp: new Date().toISOString()
          }, clientId);
          break;
        case 'chat_message':
          this.broadcastToRoom(data.roomId, {
            type: 'chat_message',
            userId: client.userId,
            message: data.message,
            timestamp: new Date().toISOString()
          }, clientId);
          break;
        case 'ai_request':
          this.handleAIRequest(clientId, data);
          break;
        default:
          console.warn(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Failed to process message'
      });
    }
  }

  handleAuthentication(clientId, data) {
    const client = this.clients.get(clientId);
    if (client) {
      client.userId = data.userId;
      this.sendToClient(clientId, {
        type: 'authenticated',
        userId: data.userId
      });
    }
  }

  handleAIRequest(clientId, data) {
    // This will be expanded with actual AI integration
    this.sendToClient(clientId, {
      type: 'ai_response',
      requestId: data.requestId,
      status: 'processing',
      message: 'AI request received and being processed'
    });
  }

  joinRoom(clientId, roomId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.rooms.add(roomId);

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId).add(clientId);

    this.sendToClient(clientId, {
      type: 'joined_room',
      roomId
    });

    this.broadcastToRoom(roomId, {
      type: 'user_joined',
      userId: client.userId,
      roomId
    }, clientId);
  }

  leaveRoom(clientId, roomId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.rooms.delete(roomId);

    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    this.broadcastToRoom(roomId, {
      type: 'user_left',
      userId: client.userId,
      roomId
    });
  }

  handleDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      // Leave all rooms
      client.rooms.forEach(roomId => {
        this.leaveRoom(clientId, roomId);
      });

      this.clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    }
  }

  sendToClient(clientId, data) {
    const client = this.clients.get(clientId);
    const WebSocket = require('ws');
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  broadcastToRoom(roomId, data, excludeClientId = null) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.forEach(clientId => {
      if (clientId !== excludeClientId) {
        this.sendToClient(clientId, data);
      }
    });
  }

  broadcast(data, excludeClientId = null) {
    const WebSocket = require('ws');
    this.clients.forEach((client, clientId) => {
      if (clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = new WebSocketService();

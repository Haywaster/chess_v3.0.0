import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

class GameWebSocketService {
  private wss: WebSocketServer;
  private clients = new Map<string, WebSocket>();
  private gameRooms = new Map<string, Set<WebSocket>>();
  
  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.initializeHandlers();
  }
  
  private initializeHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');
      
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Failed to parse message:', error);
          ws.send(JSON.stringify({ type: 'ERROR', error: 'Invalid message' }));
        }
      });
      
      ws.on('close', () => {
        console.log('WebSocket disconnected');
        this.handleDisconnect(ws);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }
  
  private handleMessage(ws: WebSocket, message: any): void {
    switch (message.type) {
      case 'CREATE_GAME':
        this.createGame(ws, message);
        break;
      case 'JOIN_GAME':
        this.joinGame(ws, message);
        break;
      case 'MOVE':
        this.handleMove(ws, message);
        break;
      default:
        ws.send(JSON.stringify({ type: 'ERROR', error: 'Unknown message type' }));
    }
  }
  
  private createGame(ws: WebSocket, message: any): void {
    const { gameId, gameType, userId } = message;
    
    // Создаём комнату
    this.gameRooms.set(gameId, new Set([ws]));
    this.clients.set(gameId, ws);
    
    // Отправляем подтверждение
    ws.send(JSON.stringify({
      type: 'GAME_CREATED',
      gameId,
      gameType,
      requestId: message.requestId,
    }));
    
    console.log(`Game ${gameId} created by user ${userId}`);
  }
  
  private joinGame(ws: WebSocket, message: any): void {
    const { gameId, userId } = message;
    const room = this.gameRooms.get(gameId);
    
    if (!room) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        error: 'Game not found',
        requestId: message.requestId,
      }));
      return;
    }
    
    // Добавляем игрока в комнату
    room.add(ws);
    this.clients.set(`${gameId}_${userId}`, ws);
    
    // Уведомляем других игроков
    this.broadcastToRoom(gameId, {
      type: 'PLAYER_JOINED',
      userId,
      gameId,
    }, ws);
    
    ws.send(JSON.stringify({
      type: 'GAME_JOINED',
      gameId,
      requestId: message.requestId,
    }));
    
    console.log(`User ${userId} joined game ${gameId}`);
  }
  
  private handleMove(ws: WebSocket, message: any): void {
    const { gameId, move, userId } = message;
    const room = this.gameRooms.get(gameId);
    
    if (!room) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'Game not found' }));
      return;
    }
    
    // Отправляем ход всем в комнате
    this.broadcastToRoom(gameId, {
      type: 'MOVE',
      gameId,
      userId,
      move,
    });
  }
  
  private broadcastToRoom(gameId: string, message: any, excludeWs?: WebSocket): void {
    const room = this.gameRooms.get(gameId);
    if (!room) return;
    
    room.forEach((client) => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  private handleDisconnect(ws: WebSocket): void {
    // Удаляем клиента из всех комнат
    this.gameRooms.forEach((room, gameId) => {
      if (room.has(ws)) {
        room.delete(ws);
        
        // Если комната пуста, удаляем её
        if (room.size === 0) {
          this.gameRooms.delete(gameId);
        } else {
          // Уведомляем остальных
          this.broadcastToRoom(gameId, {
            type: 'PLAYER_LEFT',
            gameId,
          });
        }
      }
    });
  }
  
  broadcast(message: any): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  sendToGame(gameId: string, message: any): void {
    this.broadcastToRoom(gameId, message);
  }
  
  getGameClients(gameId: string): number {
    return this.gameRooms.get(gameId)?.size || 0;
  }
}

export default GameWebSocketService;

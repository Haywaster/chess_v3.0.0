import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import prisma from '../prisma/prismaClient.ts'
import { GameStatus, GameType } from '../services/gameService.ts'

const ActionType = {
  JOIN_GAME: 'JOIN_GAME',
  MOVE: 'MOVE',
  RESIGN: 'RESIGN',
} as const

type EnumValues<
  T extends Record<string, string | number> | ReadonlyArray<string | number>
> = T extends ReadonlyArray<string | number> ? T[number] : T[keyof T]

export type TGameType = EnumValues<typeof GameType>
type TGameStatus = EnumValues<typeof GameStatus>

interface IGame {
  id: string
  type: TGameType
}

interface IJoinGameData {
  username: string
  game: Omit<IGame, 'status'>
}

interface WebsocketDataConstructor<
  T = string,
  D = Record<string, unknown>
> {
  type: T
  data: D
}

type JoinGameRequestWebsocket = WebsocketDataConstructor<
  EnumValues<typeof ActionType>,
  IJoinGameData
>

class GameWebSocketService {
  private wss: WebSocketServer;
  
  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.initializeHandlers();
  }
  
  private initializeHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');
      
      ws.on('message', async (data: string) => {
        try {
          const message = JSON.parse(data) as JoinGameRequestWebsocket;
          await this.handleMessage(ws, message)
        } catch (error) {
          console.error('Failed to parse message:', error);
          ws.send(JSON.stringify({ type: 'ERROR', error: 'Invalid message' }));
        }
      });
      
      ws.on('close', () => {
        console.log('WebSocket disconnected');
        // this.handleDisconnect(ws);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }
  
  private async handleMessage(ws: WebSocket, message: JoinGameRequestWebsocket): Promise<void> {
    switch (message.type) {
      case ActionType.JOIN_GAME:
        await this.joinGame(ws, message.data);
        break;
      // case 'MOVE':
      //   this.handleMove(ws, message);
      //   break;
      default:
        ws.send(JSON.stringify({ type: 'ERROR', error: 'Unknown message type' }));
    }
  }
  
  private async joinGame(ws: WebSocket, message: IJoinGameData): Promise<void> {
    const { game, username } = message;
    const { id: gameId } = game;
    
    const gameInDB = await prisma.game.findUnique({ where: { id: gameId } })

    if (!gameInDB) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'Game not found' }));
      return;
    }
    
    const user = await prisma.user.findUnique({ where: { login: username } })
    
    if (!user) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'User not found', }));
      return;
    }
    
    const currentUser = await prisma.gameParticipant.findUnique({
      where: { gameId_playerId: { gameId, playerId: user.id }  }
    })
    
    if (gameInDB.status === GameStatus.PENDING) {
      if (currentUser) {
        ws.send(JSON.stringify({ type: 'GAME_CREATED', data: { status: GameStatus.PENDING } }));
      } else {
        const otherPlayer = await prisma.gameParticipant.findMany({ where: { gameId } })
        
        this.wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'GAME_CREATED', data: { status: GameStatus.PLAYING } }));
          }
        })
        // otherPlayer.forEach(player => {
        //   if (player.playerId !== user.id) {
        //     if (ws.client !== excludeWs && ws.readyState === WebSocket.OPEN) {
        //       client.send(JSON.stringify(message));
        //     }
        //   }
        // })
        await prisma.gameParticipant.create({ data: { gameId, playerId: user.id } })
        ws.send(JSON.stringify({ type: 'GAME_CREATED', data: { status: GameStatus.PLAYING } }));
      }
    }
  }
  
  // private handleMove(ws: WebSocket, message: any): void {
  //   const { gameId, move, userId } = message;
  //   const room = this.gameRooms.get(gameId);
  //
  //   if (!room) {
  //     ws.send(JSON.stringify({ type: 'ERROR', error: 'Game not found' }));
  //     return;
  //   }
  //
  //   // Отправляем ход всем в комнате
  //   this.broadcastToRoom(gameId, {
  //     type: 'MOVE',
  //     gameId,
  //     userId,
  //     move,
  //   });
  // }
  
  // private async broadcastToRoom(gameId: string, message: any, excludeWs?: WebSocket): void {
  //   const room = await prisma.gameParticipant.findMany({
  //     where: { gameId },
  //   })
  //   if (!room) return;
  //
  //   room.forEach((client) => {
  //     if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
  //       client.send(JSON.stringify(message));
  //     }
  //   });
  // }
  //
  // private handleDisconnect(ws: WebSocket): void {
  //   // Удаляем клиента из всех комнат
  //   this.gameRooms.forEach((room, gameId) => {
  //     if (room.has(ws)) {
  //       room.delete(ws);
  //
  //       // Если комната пуста, удаляем её
  //       if (room.size === 0) {
  //         this.gameRooms.delete(gameId);
  //       } else {
  //         // Уведомляем остальных
  //         this.broadcastToRoom(gameId, {
  //           type: 'PLAYER_LEFT',
  //           gameId,
  //         });
  //       }
  //     }
  //   });
  // }
  
  broadcast(message: any): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  // sendToGame(gameId: string, message: any): void {
  //   this.broadcastToRoom(gameId, message);
  // }
  //
  // getGameClients(gameId: string): number {
  //   return this.gameRooms.get(gameId)?.size || 0;
  // }
}

export default GameWebSocketService;
